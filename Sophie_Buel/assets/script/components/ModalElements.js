//Import des modules
import { fetchDel, fetchJSON } from "../functions/api.js";
import {
    alertElement,
    createElement,
    getElByID,
    getElSelect,
    getElSelectAll,
} from "../functions/dom.js";
import { deleteWork, modalReload, workArray } from "../script.js";
import { galleryElements, refreshGallery } from "./GalleryElements.js";

/** @type {Number|[]|null} */
let memo = null;
/** @type {HTMLElement|null} */
let modal = null;
const modal_1 = getElByID("modal_1");
const modal_2 = getElByID("modal_2");
const modalPoint = getElByID("modal-works-gallery");
let templateModal_2 = null;

/**Sélectionne le premier élément correspondant au sélecteur spécifié.
 * @param {string} selector - Le sélecteur CSS pour la sélection de l'élément.
 * @returns {Element|null} L'élément correspondant ou null s'il n'est pas trouvé. */
const workForm = getElSelect("#work_form");
workForm?.addEventListener("submit", addWork);
const title = getElByID("title");
const new_cat = getElByID("category");
const img_element = document.createElement("img");
const postButton = getElSelect(".modal_send-img");

/** @type {RegExp} */
const img_regex = /\.(jpg|jpeg|jfif|pjpeg|pjp|png)$/i;

function cloneTemplate() {
    if (!templateModal_2) {
        templateModal_2 =
            getElSelect("#modal_2-layout")?.content.cloneNode(true);
        workForm.prepend(templateModal_2);

        /** L'élément de sélection des catégories.
         * @type {HTMLElement} */
        new_cat?.setAttribute("size", "");
        new_cat.innerHTML = `
      <option value=""></option>
      <option value="1">Object</option>
      <option value="2">Appartements</option>
      <option value="3">
        Hotels & restaurants
      </option>`;
    }
    postButtonLocked();
}

/** Ouvre la modal.
 * @param {Event} event - L'événement de clic ou de soumission.*/
export function openModal(event) {
    event.preventDefault();

    /** La cible de la modal.
     * @type {HTMLElement} */
    const target = getElSelect(event.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", true);
    modal = target;

    if (modal_2.style.display === "" && modal_1.style.display === "") {
        modal_1.style.display = "none";
        getElSelect(".js-modal_return").addEventListener("click", function () {
            modal_1.style.display = null;
        });
    }

    if (modal_2.style.display === "") {
        cloneTemplate();
        inputImg();

        /** Le template de la modal 2.
         * @type {HTMLElement} */
        const templateModal_2 = getElSelect("#modal_2-layout");

        /** Le label du template de la modal.
         * @type {HTMLElement} */
        const templateLabel = getElSelect(".modal_add-photo");

        if (!title.isEqualNode(workForm)) {
            templateModal_2?.remove();
        }
    }

    returnModal();
    closeModal(modal);
}

/** Ferme la modal.
 * @param {HTMLElement} modal - L'élément de la modal à fermer. */
export function closeModal(modal) {
    getElSelectAll(".js-modal_close").forEach((element) => {
        element.addEventListener("click", function (event) {
            removeModal(modal, event);
        });
    });
}

/** Retourne à la modal précédente.*/
export function returnModal() {
    getElSelect(".js-modal_return").addEventListener("click", function (event) {
        removeModal(modal, event);
        console.log("returnModal");
    });
}

/** Supprime la modal spécifiée.
 * @param {HTMLElement} target - L'élément modal à supprimer.
 * @param {Event} event - L'événement associé à la suppression de la modal. */
export function removeModal(target, event) {
    event.preventDefault();
    if (target === null) return;
    target.style.display = "none";
    target.setAttribute("aria-hidden", true);
    target.removeAttribute("aria-modal");
}

/** écouteur d'événement "click" pour afficher modalGallery()
 * @returns {Function}
 */
export function layoutModal() {
    /** Ajoute un écouteur d'événement "click" à tous les éléments correspondant au sélecteur ".js-modal".
     * Lorsque l'événement est déclenché, la fonction openModal est appelée.
     * @param {String} selector - Le sélecteur CSS des éléments à sélectionner.
     * @param {EventListener} element - L'élément auquel l'écouteur d'événement est attaché.
     * @param {Function} openModal - La fonction à appeler lors du déclenchement de l'événement "click".*/
    getElSelectAll(".js-modal").forEach((element) => {
        element.addEventListener("click", openModal);
    });
    return modalGallery();
}

/** Crée les éléments de la galerie modale à partir des données d'un travail.
 * @param {Object} work - Les données du travail.*/
function modalGalleryElements(work) {
    /** Crée et retourne un élément avec les attributs spécifiés.
     * @param {string} tagName - Le nom de la balise HTML de l'élément à créer, ici "figure".
     * @param {Object} attributes - Les attributs de l'élément à créer sous forme d'un objet clé-valeur.
     * @returns {HTMLElement} L'élément <figure> créé. */
    const figure_2 = createElement("figure", {
        class: "imgWork",
        "data-id": work.id,
    });
    modalPoint.append(figure_2);

    const image = createElement("img", {
        src: work.imageUrl,
        alt: work.title,
    });
    figure_2.appendChild(image);

    const deleteIcon = createElement("img", {
        src: "./assets/icons/trash_ico.svg",
        alt: "delete",
        class: "delete",
        "data-id": work.id,
    });
    figure_2.appendChild(deleteIcon);

    const moveIcon = createElement("img", {
        src: "./assets/icons/move.svg",
        alt: "move",
        class: "move",
    });
    figure_2.appendChild(moveIcon);

    const figcaption = createElement("figcaption", {}, "éditer");
    figure_2.appendChild(figcaption);
}

/** Affiche la galerie des travaux dans la modale en utilisant les éléments spécifiés.
 * @param {Array} works - Les travaux à afficher dans la galerie
 * @returns {Function|EventListener} */
export function modalGallery(works) {
    /** Rafraîchit la galerie des travaux dans la modale en supprimant tous les éléments enfants de l'élément avec l'ID "#modal-works-gallery".
     * @param {string} selector - Le sélecteur CSS de l'élément à rafraîchir.*/
    refreshGallery("#modal-works-gallery");

    if (modalPoint === null) return;
    works?.forEach((work) => {
        modalGalleryElements(work);
    });

    /**Supprime un élément du DOM ou tous.
     * @type {EventListener}*/
    deleteElement();
    deleteAllElements();
}

//**! Affichage de la gallery dans la modales **/

/** Attache un écouteur d'événement "click" à tous les éléments correspondant au sélecteur CSS ".delete".
 * Lorsque l'événement est déclenché, la fonction deleteWork est appelée.
 * @param {string} selector - Le sélecteur CSS des éléments à sélectionner.
 * @param {EventListener} element - L'élément auquel l'écouteur d'événement est attaché.
 * @param {Function} deleteWork - La fonction à appeler lors du déclenchement de l'événement "click".*/
function deleteElement() {
    const deleteElements = getElSelectAll(".delete");
    deleteElements.forEach((element) => {
        element.addEventListener("click", deleteWork);
    });
}
/** Attache un écouteur d'événement "click" à l'élément correspondant au sélecteur CSS ".edit_delete-all".
 * @param {string} selector - Le sélecteur CSS de l'élément à sélectionner.
 * @param {EventListener} element - L'élément auquel l'écouteur d'événement est attaché.
 * @param {Function} deleteAllWorks - La fonction à appeler lors du déclenchement de l'événement "click" pour supprimer tous les éléments */
function deleteAllElements() {
    const deleteAllElement = getElSelect(".edit_delete-all");
    deleteAllElement.addEventListener("click", () => {
        workArray?.forEach((work, index) => {
            deleteAllWorks(index, workArray);
        });
    });
}

/** Supprime tous les éléments en parcourant le tableau workArray.
 * @param {number} index - L'index de l'élément à supprimer.
 * @param {Array} workArray - Le tableau d'éléments à supprimer.
 * @returns {Promise<void>} Une promesse qui se résout lorsque la suppression est terminée. */
async function deleteAllWorks(index, workArray) {
    const id = workArray[index].id;
    try {
        await fetchDel(id);
        refreshGallery("#modal-works-gallery");
        refreshGallery(".gallery");
    } catch (e) {
        if (e.status == "401") {
            error();
        }
    }
}

function error() {
    const modal = getElSelect(".modal_wrapper");
    modal.style.display = "none";
    const errorMessage = "Veuillez vous connecter pour continuer";
    const error = alertElement(errorMessage);
    error.addEventListener("close", () => {
        document.location.href = "login.html";
    });
}

/** Désactive le bouton de publication.
 * @returns {void} */
function postButtonLocked() {
    postButton.disabled = true;
    postButton.style.background = "#A7A7A7";
    postButton.style.cursor = "not-allowed";
}

/** Active ou désactive le bouton de publication en fonction de la saisie de l'utilisateur.
 * @returns {void} */
function postWorkButton() {
    /** @type {FileList} */
    const files = image.files;

    /** @type {string} */
    const titleValue = title.value;

    /** @type {string} */
    const newCatValue = new_cat.value;

    if (files.length > 0 && titleValue !== "" && newCatValue !== "") {
        postButton.style.background = "#1D6154";
        postButton.disabled = false;
        postButton.style.cursor = "pointer";
    }

    if (files.length > 0) {
        title.addEventListener("input", postWorkButton);
        new_cat.addEventListener("input", postWorkButton);
        image.addEventListener("input", postWorkButton);
        workForm.addEventListener("submit", addWork);
    }
}

/** @type {HTMLInputElement} */
let image;
/** Crée et retourne un nouvel élément d'entrée de type "file" pour l'image.
 * @returns {HTMLInputElement} L'élément d'entrée de type "file" créé. */
function createImageElement() {
    /** @type {HTMLInputElement} */
    image = document.createElement("input");
    image.id = "image";
    image.name = "image";
    image.type = "file";
    image.style.display = "none";
}

/** Gère l'ajout de l'élément d'entrée pour l'image.
 * @returns {void} */
function inputImg() {
    /** @type {HTMLElement} */
    const add_img = getElSelect(".add_img");

    if (!image) {
        createImageElement();
    }

    add_img?.append(image);

    /** Ajoute un écouteur d'événement "change" à l'élément d'entrée de fichier pour prévisualiser le fichier sélectionné.
     * @param {Event} event - L'événement "change" déclenché lorsque le fichier est sélectionné.
     * @returns {void} */
    image.addEventListener("change", previewFile);
}

/** Gère la sélection et l'affichage de l'image choisie.
 * @param {Event} e - L'événement de changement de fichier.
 * @returns {void} */
function previewFile(e) {
    /** @type {FileList} */
    const files = this.files;

    if (files?.length === 0 || !img_regex.test(files[0]?.name)) {
        alertElement("Le format d'image choisi n'est pas valide");
        return;
    }

    /** @type {File} */
    const file = files[0];
    /** @type {string} */
    const url = URL?.createObjectURL(file);
    const imgUrl = `http://localhost:5678/images/${file.name}`;

    /** @type {Object} */
    memo = {
        url: imgUrl,
    };
    console.log("file =", imgUrl, "url =", url);

    /** @type {HTMLImageElement} */
    const img_element = document.createElement("img");
    img_element.src = url;
    img_element.classList.add("done");

    /** @type {HTMLElement} */
    const labelFile = getElSelect(".modal_add-photo");
    labelFile.innerHTML = "";
    labelFile.appendChild(img_element);

    postWorkButton();
}
/** Ajoute un nouveau travail en utilisant les données du formulaire.
 * @param {Event} e - L'événement de soumission du formulaire.
 * @returns {Promise<void>} Une promesse qui se résout lorsque le travail est ajouté. */
async function addWork(e) {
    e.preventDefault();

    /** @type {FormData} */
    const formData = new FormData();
    formData.append("image", image?.files[0]);
    formData.append("title", title.value);
    formData.append("category", parseInt(new_cat.value, 10));

    console.log("1 formData =", formData.content);

    try {
        /** @type {Response} */
        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.user,
            },
            body: formData,
        }).then((res) => {
            if (!res.ok) {
                /** @type {HTMLElement} */
                const errorMessage = alertElement(
                    "Session expirée, merci de vous reconnecter"
                );
                errorMessage.addEventListener("close", () => {
                    document.location.href = "login.html";
                });
            }
        });

        await modalReload();

        workForm.reset();
        resetModalPOST();
    } catch (e) {
        console.error(e);
    }

    /** @type {NodeListOf<HTMLElement>} */
    const elements = getElSelectAll(".imgWork");
    const lastElement = elements[elements.length - 1];

    console.log(lastElement.dataset.id);

    /** @type {Object} */
    const newMem = {
        imageUrl: memo.url,
        title: title.value,
        id: lastElement.dataset.id,
    };

    galleryElements(newMem);
}

/** Réinitialise le formulaire et l'affichage de l'élément imput file et image.
 * @returns {void} */
function resetModalPOST() {
    /** @type {HTMLElement} */
    const labelFile = getElSelect(".modal_add-photo");
    postButtonLocked();
    labelFile.innerHTML = `
    <img src="assets/icons/sendBoxImg.svg" alt="sendBoxImg"/>
    <a class="add_img">+ Ajouter photo</a>
    `;

    if (image) {
        image.remove();
        image = null;
    }

    inputImg();
}
