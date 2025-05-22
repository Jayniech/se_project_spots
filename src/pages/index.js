import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import avatarImg from "../images/avatar.jpg";
console.log("Local avatar path:", avatarImg);
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

let currentUser;

api
  .getAppInfo()
  .then(([cards, user]) => {
    currentUser = user;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    if (!user.avatar) {
      avatar.src = avatarImg; // Use API avatar if it exists
    } else {
      avatar.src = user.avatar; // Use local avatar if no API avatar
    }
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
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

const avatarModalForm = document.forms["edit-avatar-form"];
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitButton = avatarModalForm.querySelector(
  "#profile-avatar-submit-button"
);

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-form"];
const deleteCancelButton = deleteModal.querySelector("#delete-cancel-button");

const modals = document.querySelectorAll(".modal");

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(likeButton, id) {
  //
  // 1. check whether card is currently liked or not
  const isLiked = likeButton.classList.contains("card__like-btn_liked");
  // 2. call the changeLikeStatus method, passing it the appropriate arguments
  api
    .handleLikeStatus(id, !isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
  // 3. handle the response (.then and .catch)
  // 4. in the .then, toggle active class
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const postLikeButton = cardElement.querySelector(".card__like-btn");
  const postDeleteButton = cardElement.querySelector(".card__delete-btn");

  // TODO - if the card is liked, set the active class on the card
  console.log("Card data:", data);
  if (data.isLiked) {
    postLikeButton.classList.add("card__like-btn_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  postLikeButton.addEventListener("click", () => {
    handleLike(postLikeButton, data._id);
  });

  postDeleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

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
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
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
  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(addPostModal);
      disabledButton(addPostSubmitButton, settings);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatar.src = data.avatar;
      closeModal(avatarModal);
      avatarModalForm.reset();
    })
    .catch(console.error);
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

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});
//I really like how this saves so many lines of code.

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

profileForm.addEventListener("submit", handleEditFormSubmit);
addPostForm.addEventListener("submit", handleAddPostSubmit);
avatarModalForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
