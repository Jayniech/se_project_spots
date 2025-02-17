const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileForm = document.forms["profile-form"];

const addPostButton = document.querySelector(".profile__add-btn");

const editModalProfile = document.querySelector("#edit-profile-modal");
const editModalCloseButton =
  editModalProfile.querySelector(".modal__close-btn");
const editModalNameInput = editModalProfile.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editModalProfile.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const addPostModal = document.querySelector("#add-post-modal");
const addPostCloseButton = addPostModal.querySelector(".modal__close-btn");
const addPostLinkInput = addPostModal.querySelector("#add-post-link-input");
const addPostCaptionInput = addPostModal.querySelector(
  "#add-post-caption-input"
);
const addPostForm = addPostModal.querySelector(".modal__form");
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const postLikeButton = cardElement.querySelector(".card__like-btn");
  const postDeleteButton = cardElement.querySelector(".card__delete-btn");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  postLikeButton.addEventListener("click", () => {
    postLikeButton.classList.toggle("card__like-btn_liked");
  });

  postDeleteButton.addEventListener("click", () => {
    const postItem = postDeleteButton.closest(".card");
    postItem.remove();
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModalProfile);
}

function handleAddPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: addPostCaptionInput.value,
    link: addPostLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(addPostModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModalProfile);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModalProfile);
});

addPostButton.addEventListener("click", () => {
  openModal(addPostModal);
});

addPostCloseButton.addEventListener("click", () => {
  closeModal(addPostModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

profileForm.addEventListener("submit", handleEditFormSubmit);
addPostForm.addEventListener("submit", handleAddPostSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
