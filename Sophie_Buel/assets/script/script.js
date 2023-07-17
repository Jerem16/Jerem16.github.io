import {
    createFilter,
    createGallery,
    filterResult,
    refreshGallery,
} from "./components/GalleryElements.js";
import { layoutModal, modalGallery } from "./components/ModalElements.js";
import { fetchJSON, fetchDel } from "./functions/api.js";

/** @type {string} */
const GetGallery = "http://localhost:5678/api/works";
/** @type {string} */
const GetCategories = "http://localhost:5678/api/categories";

/** @type {Array} */
export let category = [];
/** @type {Array} */
export let workArray = [];

/**
 * Récupère les catégories et les éléments de la galerie depuis les API, puis rafraîchit la galerie.
 * @async
 */
export async function gallery() {
    [category, workArray] = await Promise.all([
        fetchJSON(GetCategories),
        fetchJSON(GetGallery),
    ]);

    refreshGallery(".gallery");
}

/**
 * Supprime un élément de la galerie.
 * @param {Event} element - L'élément déclencheur de l'événement.
 * @async
 */
export async function deleteWork(element) {
    /** @type {string} */
    const id = this?.dataset.id;

    try {
        await fetchDel(id);
        del(id, ".data_selected");
        element.target.parentElement.remove();
    } catch (e) {
        if (e.status == "401") {
            error();
        }
    }
}

/**
 * Supprime un élément de la galerie en fonction de son ID.
 * @param {string} delId - L'ID de l'élément à supprimer.
 * @param {string} selector - Le sélecteur CSS pour trouver les éléments à supprimer.
 */
function del(delId, selector) {
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        if (element.dataset.id == delId) {
            element.remove();
        }
    }
}

/**
 * Recharge la galerie dans la fenêtre modale.
 * @async
 */
export async function modalReload() {
    workArray = await fetchJSON(GetGallery);
    modalGallery(workArray);
}

await gallery();
await show();
layoutModal();

/**
 * Affiche la galerie sur la page.
 * @async
 */
async function show() {
    createGallery(workArray);
    createFilter(category);
    filterResult(workArray);
    modalReload();
}
