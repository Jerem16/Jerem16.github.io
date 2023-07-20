const filterLinks = document.querySelectorAll(".filter li");
filterLinks.forEach((filterLink) => {
    filterLink.addEventListener("click", function () {
        const tag = filterLink.getAttribute("data-filter");
        filterImages(tag);
        activateFilterLink(filterLink);
    });
});

function activateFilterLink(link) {
    const filterLinks = document.querySelectorAll(".filter > li");
    filterLinks.forEach((filterLink) => {
        filterLink.classList.remove("nav_link_active");
    });
    link.classList.add("nav_link_active");
}
function filterImages(tag) {
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
        const itemTag = item.getAttribute("data-gallery-tag");
        if (tag === "all" || itemTag === tag) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

filterImages("all");
