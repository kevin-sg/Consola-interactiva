require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
	inquirerMenu,
	pausa,
	leerInput,
	listadoBorrar,
	confirmar,
	mostrarListadoCheckList,
} = require("./helpers/inquirer");

const Tareas = require("./models/tareas");

// File 5 -> clase 11
const main = async () => {
	let opt = "";
	const tareas = new Tareas();

	const tareasDB = leerDB();

	if (tareasDB) {
		// TODO: cargarTareas
		tareas.cargarTareasFromArray(tareasDB);
	}

	do {
		// Imprimir el menú
		opt = await inquirerMenu();

		switch (opt) {
			case "1": // Crear opcion
				const desc = await leerInput("Descripción:");
				tareas.crearTarea(desc);
				break;

			case "2": // Listar tarea
				tareas.listadoCompleto();
				break;

			case "3": // Listar tareas completas
				tareas.listarPendienteCompletadas(true);
				break;

			case "4": // Listar tareas pendientes
				tareas.listarPendienteCompletadas(false);
				break;

			case "5": // Completado
				const ids = await mostrarListadoCheckList(tareas.listadoArr);
				tareas.toggleCompletadas(ids);
				break;

			case "6": // Borrar Tarea
				const id = await listadoBorrar(tareas.listadoArr);
				if (id !== "0") {
					const ok = await confirmar("¿Está seguro?");

					if (ok) {
						tareas.borrarTarea(id);
						console.log("Tarea borrada");
					}
				}
				break;

			default:
				break;
		}

		// Guardar tarea
		guardarDB(tareas.listadoArr);

		// Preguntar
		await pausa();
	} while (opt !== "0");
};

main();
