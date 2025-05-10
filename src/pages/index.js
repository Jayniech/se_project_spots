import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import avatarImg from "../images/avatar.jpg";
import logoImg from "../images/logo.svg";
import Api from "../utils/Api.js";

const avatar = document.getElementById("avatar-image");
const logo = document.getElementById("logo-image");
avatar.src = avatarImg;
logo.src = logoImg;

// const initialCards = [
//  {
//    name: "Golden Gate Bridge",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//  },
//  {
//    name: "Val Thorens",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//  },
//  {
//    name: "Restaurant terrace",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//  },
//  {
//    name: "An outdoor cafe",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//  },
//  {
//    name: "A very long bridge, over the forest and through the trees",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//  },
//  {
//    name: "Tunnel with morning light",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//  },
//  {
//    name: "Mountain house",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//  },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3a91e644-a6d3-4fc6-a8f2-7fb2773395d1",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, user]) => {
    console.log(cards);
    console.log(user);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    //user.forEach((item) => {
    //
    // });

    // Handle the user's information
    // - set the src of the avatar image
    // - set the textContent of both the text elements
  })
  .catch((err) => {
    console.error(err);
  });

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileForm = document.forms["profile-form"];
const editModalProfile = document.querySelector("#edit-profile-modal");
const editModalNameInput = editModalProfile.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editModalProfile.querySelector(
  "#profile-description-input"
);
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const addPostButton = document.querySelector(".profile__add-btn");
const addPostModal = document.querySelector("#add-post-modal");
const addPostLinkInput = addPostModal.querySelector("#add-post-link-input");
const addPostCaptionInput = addPostModal.querySelector(
  "#add-post-caption-input"
);
const addPostForm = document.forms["add-post-form"];
const addPostSubmitButton = addPostForm.querySelector("#post-submit-button");
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-btn");

const modals = document.querySelectorAll(".modal");

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
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", keyHandler);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", keyHandler);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.editModalNameInput;
      profileDescription.textContent = data.editModalDescriptionInput;
      closeModal(editModalProfile);
    })
    .catch(console.error);
}

function handleAddPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: addPostCaptionInput.value,
    link: addPostLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  closeModal(addPostModal);
  disabledButton(addPostSubmitButton, settings);
}

function keyHandler(evt) {
  if (evt.key === "Escape") {
    //Need to find the current opened modal in order to close it.
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

modals.forEach((modalElement) => {
  modalElement.addEventListener("click", (evt) => {
    //Select the element that has the .modal class, not the entire modal.
    if (evt.target === modalElement) {
      closeModal(modalElement);
    }
  });
});

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModalProfile);
  resetValidation(
    profileForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

addPostButton.addEventListener("click", () => {
  openModal(addPostModal);
  resetValidation(
    addPostForm,
    [addPostLinkInput, addPostCaptionInput],
    settings
  );
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});
//I really like how this saves so many lines of code.

profileForm.addEventListener("submit", handleEditFormSubmit);
addPostForm.addEventListener("submit", handleAddPostSubmit);

enableValidation(settings);
