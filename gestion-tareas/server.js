
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Lista inicial de tareas
let tareas = [
    {
        titulo: "Estudiar JavaScript",
        descripcion: "Repasar variables y ciclos",
        estado: "pendiente",
        pasos: ["Leer apuntes", "Hacer ejercicios"]
    },
    {
        titulo: "Hacer taller",
        descripcion: "Terminar la actividad de clase",
        estado: "completada",
        pasos: ["Leer instrucciones", "Resolver preguntas"]
    }
];

// Ruta principal
app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de gestion de tareas funcionando"
    });
});

// Obtener todas las tareas
app.get("/tareas", (req, res) => {
    res.status(200).json(tareas);
});

// Obtener una tarea por titulo
app.get("/tareas/buscar/:titulo", (req, res) => {
    const titulo = req.params.titulo.toLowerCase();

    const tarea = tareas.find(
        tarea => tarea.titulo.toLowerCase() === titulo
    );

    if (!tarea) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    res.status(200).json(tarea);
});

// Obtener tareas pendientes
app.get("/tareas/pendientes", (req, res) => {
    const pendientes = tareas.filter(
        tarea => tarea.estado === "pendiente"
    );

    res.status(200).json(pendientes);
});

// Obtener tareas completadas
app.get("/tareas/completadas", (req, res) => {
    const completadas = tareas.filter(
        tarea => tarea.estado === "completada"
    );

    res.status(200).json(completadas);
});

// Agregar una tarea
app.post("/tareas", (req, res) => {
    const { titulo, descripcion, pasos } = req.body;

    if (!titulo || !descripcion || !Array.isArray(pasos)) {
        return res.status(400).json({
            mensaje: "Ingresa titulo, descripcion y pasos en una lista"
        });
    }

    const existe = tareas.some(
        tarea => tarea.titulo.toLowerCase() === titulo.trim().toLowerCase()
    );

    if (existe) {
        return res.status(400).json({
            mensaje: "Ya existe una tarea con ese titulo"
        });
    }

    const nuevaTarea = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estado: "pendiente",
        pasos: pasos
    };

    tareas.push(nuevaTarea);

    res.status(201).json({
        mensaje: "Tarea creada correctamente",
        tarea: nuevaTarea
    });
});

// Actualizar una tarea existente
app.put("/tareas/:titulo", (req, res) => {
    const titulo = req.params.titulo.toLowerCase();
    const { descripcion, pasos } = req.body;

    const tarea = tareas.find(
        tarea => tarea.titulo.toLowerCase() === titulo
    );

    if (!tarea) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    if (descripcion !== undefined) {
        if (typeof descripcion !== "string" || !descripcion.trim()) {
            return res.status(400).json({
                mensaje: "La descripcion no puede estar vacia"
            });
        }
        tarea.descripcion = descripcion.trim();
    }

    if (pasos !== undefined) {
        if (!Array.isArray(pasos)) {
            return res.status(400).json({
                mensaje: "Los pasos deben ser una lista"
            });
        }
        tarea.pasos = pasos;
    }

    res.status(200).json({
        mensaje: "Tarea actualizada correctamente",
        tarea: tarea
    });
});

// Cambiar el estado de una tarea
app.patch("/tareas/:titulo/estado", (req, res) => {
    const titulo = req.params.titulo.toLowerCase();
    const { estado } = req.body;

    const tarea = tareas.find(
        tarea => tarea.titulo.toLowerCase() === titulo
    );

    if (!tarea) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    if (!["pendiente", "completada"].includes(estado)) {
        return res.status(400).json({
            mensaje: "El estado debe ser pendiente o completada"
        });
    }

    tarea.estado = estado;

    res.status(200).json({
        mensaje: "Estado actualizado correctamente",
        tarea: tarea
    });
});

// Eliminar una tarea
app.delete("/tareas/:titulo", (req, res) => {
    const titulo = req.params.titulo.toLowerCase();

    const indice = tareas.findIndex(
        tarea => tarea.titulo.toLowerCase() === titulo
    );

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    const eliminada = tareas.splice(indice, 1)[0];

    res.status(200).json({
        mensaje: "Tarea eliminada correctamente",
        tarea: eliminada
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});


