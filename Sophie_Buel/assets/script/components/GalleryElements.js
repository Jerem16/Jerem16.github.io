import {
    createElement,
    getElSelect,
    getElSelectAll,
} from "../functions/dom.js";

/** Crée et retourne une barre de filtres pour les catégories.
 * @param {Array} category - La liste des catégories.
 * @returns {Array} La liste des catégories. */
export function createFilter(category) {
    const filterPoint = getElSelect("#portfolio h2");
    const filterUl = createElement("ul", {
        class: "filterBar",
    });

    filterUl.innerHTML = `<li class="filter">Tous</li> `;
    filterPoint.append(filterUl);

    category.forEach((categoryItem) => {
        const filterLi = createElement("li", {
            class: "filter",
        });

        filterLi.innerText = categoryItem.name;
        filterUl.append(filterLi);
    });

    // Retire les filtres dans edit.html
    if (window.location.pathname === "/edit.html") {
        filterUl.style.display = "none";
    }

    return category;
}

/**@type {HTMLElement} */
const gallery = getElSelect(".gallery");

/**Crée la galerie en ajoutant chaque élément de travail.
 * @param {Array} works - Le tableau des travaux.*/
export function createGallery(works) {
    works?.forEach(galleryElements);
}

/**Crée un élément de travail individuel dans la galerie.
 * @param {Object} work - L'objet du travail.
 * @returns {HTMLElement} - L'élément figure créé.*/
export function galleryElements(work) {
    const figure = createElement("figure", {
        class: "data_selected",
        "data-id": work.id,
    });
    gallery.append(figure);
    figure.innerHTML = `
      <img src=${work.imageUrl} alt=${work.title}>
      <img src="./assets/icons/trash_ico.svg" alt="delete" class="delete hidden" data-id=${work.id}>
      <figcaption>${work.title}</figcaption>`;
    return figure;
}

/**Filtre les travaux en fonction de la catégorie sélectionnée.
 * @param {Array} works - Le tableau des travaux.
 * @returns {Array} - Le tableau des travaux filtré.*/
export function filterResult(works) {
    const filterByCategory = getElSelectAll(".filter");

    filterByCategory.forEach((filter, i) => {
        filter.addEventListener("click", function () {
            if (i !== 0) {
                const filteredGallery = works.filter(
                    (el) => el.categoryId === i
                );
                refreshGallery(".gallery");
                createGallery(filteredGallery);
            } else {
                refreshGallery(".gallery");
                createGallery(works);
            }
        });
    });

    return works;
}

/**Rafraîchit la galerie en effaçant son contenu.
 * @param {string} selector - Le sélecteur CSS de la galerie.*/
export function refreshGallery(selector) {
    const gallery = getElSelect(selector);

    if (gallery !== null) {
        gallery.innerHTML = "";
    }
}
