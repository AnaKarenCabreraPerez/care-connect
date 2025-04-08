require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Obtener todos los pacientes (sin signos vitales ni medicamentos)
app.get("/patients", async (req, res) => {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Obtener un paciente por ID con sus signos vitales y medicamentos
app.get("/patients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();
    if (patientError || !patient)
      return res.status(404).json({ error: "Paciente no encontrado" });

    const { data: vitals, error: vitalsError } = await supabase
      .from("vitals")
      .select("*")
      .eq("patient_id", id);
    const { data: medications, error: medicationsError } = await supabase
      .from("medications")
      .select("*")
      .eq("patient_id", id);

    if (vitalsError || medicationsError)
      return res
        .status(500)
        .json({ error: "Error al obtener datos relacionados" });

    res.json({ patient, vitals, medications });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar un nuevo paciente
app.post("/patients", async (req, res) => {
  const { nombre, apellido, edad, estado_salud } = req.body;
  const { data, error } = await supabase
    .from("patients")
    .insert([{ nombre, apellido, edad, estado_salud }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Editar la información de un paciente
app.put("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, estado_salud } = req.body;
  const { data, error } = await supabase
    .from("patients")
    .update({ nombre, apellido, edad, estado_salud })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Eliminar un paciente y sus relaciones
app.delete("/patients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await supabase.from("vitals").delete().eq("patient_id", id);
    await supabase.from("medications").delete().eq("patient_id", id);
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el paciente" });
  }
});

// Registrar una medición vital
app.post("/vitals", async (req, res) => {
  const {
    patient_id,
    pulso,
    frecuencia_respiratoria,
    presion_arterial,
    temperatura,
    oxigenacion,
    peso,
    estatura,
    nivel_glucosa,
  } = req.body;
  const { data, error } = await supabase
    .from("vitals")
    .insert([
      {
        patient_id,
        pulso,
        frecuencia_respiratoria,
        presion_arterial,
        temperatura,
        oxigenacion,
        peso,
        estatura,
        nivel_glucosa,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Obtener la última medición de signos vitales de un paciente con siguiente medicamento
app.get("/vitals/last/:patient_id", async (req, res) => {
  const { patient_id } = req.params;

  try {
    const { data: vitals, error: vitalsError } = await supabase
      .from("vitals")
      .select("*")
      .eq("patient_id", patient_id)
      .order("fecha_registro", { ascending: false })
      .limit(1);

    if (vitalsError)
      return res.status(500).json({ error: vitalsError.message });

    if (!vitals || vitals.length === 0)
      return res.status(404).json({
        error: "No hay registros de signos vitales para este paciente",
      });

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("nombre, apellido, edad, estado_salud")
      .eq("id", patient_id)
      .single();

    if (patientError || !patient)
      return res.status(404).json({ error: "Paciente no encontrado" });

    const { data: medications, error: medicationsError } = await supabase
      .from("medications")
      .select("id, medicamento, dosis, ultima_toma, frecuencia")
      .eq("patient_id", patient_id);

    if (medicationsError)
      return res.status(500).json({ error: medicationsError.message });

    const now = new Date();

    const medicamentosConProximaToma = medications
      .filter((med) => med.ultima_toma && med.frecuencia)
      .map((med) => {
        const [cantidad, unidad] = med.frecuencia.toLowerCase().split(" ");
        const frecuenciaHoras = unidad?.includes("hora")
          ? parseInt(cantidad)
          : parseInt(med.frecuencia);

        if (!frecuenciaHoras || isNaN(frecuenciaHoras)) return null;

        const ultimaToma = new Date(med.ultima_toma);
        const siguienteToma = new Date(
          ultimaToma.getTime() + frecuenciaHoras * 60 * 60 * 1000
        );

        return {
          medicamento: med.medicamento,
          dosis: med.dosis,
          frecuencia: med.frecuencia,
          siguiente_toma: siguienteToma.toISOString(),
          atrasado: siguienteToma < now,
        };
      })
      .filter((med) => med !== null);

    medicamentosConProximaToma.sort(
      (a, b) => new Date(a.siguiente_toma) - new Date(b.siguiente_toma)
    );

    res.json({
      ...vitals[0],
      paciente: patient,
      medicamentos: medicamentosConProximaToma,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener tendencias de signos vitales
app.get("/vitals/trends/:patient_id", async (req, res) => {
  const { patient_id } = req.params;

  const { data, error } = await supabase
    .from("vitals")
    .select(
      "fecha_registro, pulso, frecuencia_respiratoria , presion_arterial, temperatura, oxigenacion, peso, estatura, nivel_glucosa"
    )
    .eq("patient_id", patient_id)
    .order("fecha_registro", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0)
    return res
      .status(404)
      .json({ error: "No hay registros suficientes para calcular tendencia" });

  res.json({ tendencia: data });
});

// Obtener todos los medicamentos de un paciente
app.get("/patients/:id/medications", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("patient_id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// Agregar un nuevo medicamento a un paciente
app.post("/patients/:id/medications", async (req, res) => {
  const { id } = req.params;
  const { medicamento, dosis, frecuencia } = req.body;

  const { data, error } = await supabase
    .from("medications")
    .insert([{ patient_id: id, medicamento, dosis, frecuencia }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
});

// Editar un medicamento existente
app.put("/medications/:med_id", async (req, res) => {
  const { med_id } = req.params;
  const { medicamento, dosis, frecuencia } = req.body;

  const { data, error } = await supabase
    .from("medications")
    .update({ medicamento, dosis, frecuencia })
    .eq("id", med_id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data[0]);
});

// Eliminar uno o más medicamentos por IDs
app.delete("/medications", async (req, res) => {
  const { ids } = req.body; // Espera un array de IDs
  if (!Array.isArray(ids))
    return res.status(400).json({ error: "Se requiere un arreglo de IDs" });

  const { error } = await supabase.from("medications").delete().in("id", ids);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Medicamentos eliminados correctamente" });
});

// Actualizar la última toma de un medicamento
app.put("/medications/:med_id/update-last-dose", async (req, res) => {
  const { med_id } = req.params;

  const { data, error } = await supabase
    .from("medications")
    .update({ ultima_toma: new Date().toISOString() })
    .eq("id", med_id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Última toma actualizada", medicamento: data[0] });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
