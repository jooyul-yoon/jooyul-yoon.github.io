/* Body */
const body = document.querySelector("body")!;
const contents: HTMLElement = document.querySelector("ul")!;

/* Navigation */
const imgBtn: HTMLButtonElement = document.querySelector("#imgBtn")!;
const videoBtn: HTMLButtonElement = document.querySelector("#videoBtn")!;
const noteBtn: HTMLButtonElement = document.querySelector("#noteBtn")!;
const todoBtn: HTMLButtonElement = document.querySelector("#todoBtn")!;

/* Modal */
const modal: HTMLElement = document.querySelector(".modal")!;
const modalContent: HTMLElement = document.querySelector(".modal-content")!;
const titleInput: HTMLElement = document.querySelector("#modal-title")!;
const submit: HTMLSpanElement = document.querySelector("#modal-return")!;
const contentInput: HTMLElement = document.querySelector("#modal-content")!;
const pTitle = titleInput.querySelector("p")!;
const inputTitle = titleInput.querySelector("input")!;
const pContent = contentInput.querySelector("p")!;
const inputContent = contentInput.querySelector("input")!;
submit.textContent = "Return";
pTitle.textContent = "Title";
inputTitle.setAttribute("placeholder", "Title");

const inputInvalid = (): boolean => {
  if (inputTitle.value.length <= 0 || inputContent.value.length <= 0) {
    alert("Please enter a valid input");
    return true;
  }
  return false;
};
// When the user clicks the button, open the modal
imgBtn.onclick = () => {
  pContent.textContent = "URL";
  inputContent.setAttribute("placeholder", "image url");
  modal.style.display = "block";
  submit.onclick = () => {
    if (inputInvalid()) return;
    createCard(new ImageCard(inputTitle.value, inputContent.value));
    inputTitle.value = "";
    inputContent.value = "";
    modal.style.display = "none";
  };
};
videoBtn.onclick = () => {
  pContent.textContent = "URL";
  inputContent.setAttribute("placeholder", "video url");
  modal.style.display = "block";
  submit.onclick = () => {
    if (inputInvalid()) return;
    createCard(new VideoCard(inputTitle.value, inputContent.value));
    inputTitle.value = "";
    inputContent.value = "";
    modal.style.display = "none";
  };
};
noteBtn.onclick = () => {
  pContent.textContent = "Note";
  inputContent.setAttribute("placeholder", "note");
  modal.style.display = "block";
  submit.onclick = () => {
    if (inputInvalid()) return;
    createCard(new NoteCard(inputTitle.value, inputContent.value));
    inputTitle.value = "";
    inputContent.value = "";
    modal.style.display = "none";
  };
};
todoBtn.onclick = () => {
  pContent.textContent = "Tasks";
  inputContent.setAttribute("placeholder", "sperated by ,");
  modal.style.display = "block";
  submit.onclick = () => {
    if (inputInvalid()) return;
    createCard(new ToDoCard(inputTitle.value, inputContent.value));
    inputTitle.value = "";
    inputContent.value = "";
    modal.style.display = "none";
  };
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/* Drag and Drop */
function allowDrop(e: Event) {
  e.preventDefault();
}
function drag(e: DragEvent) {
  const elem = e.target as Element;
  if (elem == null) throw new Error("Start element is null");
  if (elem.parentElement == null)
    throw new Error("From element's parent is null");
  e.dataTransfer?.setData("text", getIndex(elem.parentElement));
}
function drop(e: DragEvent) {
  const elemTo = e.target as Element;
  if (e.dataTransfer == null) throw new Error("Data transfer is null");
  if (elemTo == null) throw new Error("Start element is null");
  if (elemTo.parentElement == null)
    throw new Error("From element's parent is null");
  const elemFromIndex: number = parseInt(e.dataTransfer.getData("text"));
  const elemToIndex: number = parseInt(getIndex(elemTo.parentElement));
  swapCard(cards, elemFromIndex, elemToIndex);
  repaint();
}
const getIndex = (elem: Element): string | any => {
  if (elem == null) throw new Error("This element is null");
  if (elem.parentElement == null) throw new Error("Parent Node is null");

  while (elem.parentElement != contents) {
    elem = elem.parentElement as Element;
  }
  for (let i = 0; i < contents.childNodes.length; i++) {
    if ((contents.childNodes[i] as Element) == elem) return i.toString();
  }
  throw new Error("this element does not exist");
};
const swapCard = (
  cards: Card[],
  elemFromIndex: number,
  elemToIndex: number
): void => {
  if (elemFromIndex > elemToIndex) {
    cards.splice(elemToIndex, 0, cards[elemFromIndex]);
    cards.splice(elemFromIndex + 1, 1);
  } else {
    cards.splice(elemToIndex + 1, 0, cards[elemFromIndex]);
    cards.splice(elemFromIndex, 1);
  }
};

/* Create Card */
const createCard = (newCard: Card): void => {
  cards.push(newCard);
  repaint();
};
const repaint = (): void => {
  contents.innerHTML = "";
  cards.forEach((card) => {
    const cardElement = card.createElement();
    if (cardElement == null) {
      alert("ERROR");
      return;
    }
    contents.appendChild(cardElement);
    contents.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  });
};

const deleteCard = (cardToDelete: Card): void => {
  cards.splice(cards.indexOf(cardToDelete), 1);
};

/**
 * It can be implemented by
 * [Note Card] [Image Card]
 */
interface Card {
  readonly title: string;
  createElement(): HTMLElement | null;
}

class NoteCard implements Card {
  get title(): string {
    return this._title;
  }
  get note(): string {
    return this._note;
  }
  constructor(private _title: string, private _note: string) {}

  createElement(): HTMLElement | null {
    let elem: HTMLElement = document.createElement("li");

    const section = document.createElement("section");
    const article = document.createElement("article");
    const closeBtn = document.createElement("span");
    const pTitle = document.createElement("p");
    const pNote = document.createElement("p");

    section.classList.add("card");
    pTitle.classList.add("title");
    pNote.classList.add("note");
    closeBtn.classList.add("close");

    section.draggable = true;
    section.setAttribute("ondragstart", "drag(event)");
    section.setAttribute("ondrop", "drop(event)");
    section.setAttribute("ondragover", "allowDrop(event)");

    pTitle.textContent = this.title;
    pNote.textContent = this.note;
    closeBtn.textContent = "×";
    closeBtn.onclick = () => {
      if (elem.parentElement == null) {
        throw new Error("List parent is null");
      }
      deleteCard(this);
      repaint();
    };

    article.appendChild(pTitle);
    article.appendChild(pNote);
    section.appendChild(article);
    section.appendChild(closeBtn);

    elem.append(section);
    return elem;
  }
}

class ToDoCard implements Card {
  private tasks: string[];
  get title() {
    return this._title;
  }
  constructor(private _title: string, _tasks: string) {
    this.tasks = _tasks.split(",");
  }
  createElement(): HTMLElement {
    const elem: HTMLElement = document.createElement("li");

    const section = document.createElement("section");
    const article = document.createElement("article");
    const closeBtn = document.createElement("span");
    const pTitle = document.createElement("p");
    const pToDo = document.createElement("p");

    section.classList.add("card");
    closeBtn.classList.add("close");
    pTitle.classList.add("title");
    pToDo.classList.add("toDo");

    section.draggable = true;
    section.setAttribute("ondragstart", "drag(event)");
    section.setAttribute("ondrop", "drop(event)");
    section.setAttribute("ondragover", "allowDrop(event)");

    pTitle.textContent = this._title;
    this.tasks.forEach((task) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.onclick = () => {
        if (input.checked) label.classList.add("strikethrough");
        else label.classList.remove("strikethrough");
      };
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + task));
      pToDo.appendChild(label);
      pToDo.appendChild(document.createElement("br"));
    });
    closeBtn.textContent = "×";
    closeBtn.onclick = () => {
      if (elem.parentElement == null) {
        throw new Error("List parent is null");
      }
      deleteCard(this);
      repaint();
    };

    article.appendChild(pTitle);
    article.appendChild(pToDo);
    section.appendChild(article);
    section.appendChild(closeBtn);

    elem.append(section);
    return elem;
  }
}

class ImageCard implements Card {
  get title() {
    return this._title;
  }
  constructor(private _title: string, private url: string) {}
  createElement(): HTMLElement {
    const elem: HTMLElement = document.createElement("li");

    const section = document.createElement("section");
    const source = document.createElement("article");
    const description = document.createElement("article");
    const image = document.createElement("img");
    const pTitle = document.createElement("p");
    const closeBtn = document.createElement("span");

    section.classList.add("card");
    source.classList.add("source");
    description.classList.add("description");

    section.draggable = true;
    section.setAttribute("ondragstart", "drag(event)");
    section.setAttribute("ondrop", "drop(event)");
    section.setAttribute("ondragover", "allowDrop(event)");

    pTitle.classList.add("title");
    closeBtn.classList.add("close");

    image.src = this.url;
    pTitle.textContent = this.title;
    closeBtn.textContent = "×";
    closeBtn.onclick = () => {
      if (elem.parentElement == null) {
        throw new Error("List parent is null");
      }
      deleteCard(this);
      repaint();
    };

    source.appendChild(image);
    description.appendChild(pTitle);
    section.appendChild(source);
    section.appendChild(description);
    section.appendChild(closeBtn);

    elem.append(section);
    return elem;
  }
}

class VideoCard implements Card {
  get title() {
    return this._title;
  }
  constructor(private _title: string, private url: string) {}
  createElement(): HTMLElement {
    const elem: HTMLElement = document.createElement("li");

    const section = document.createElement("section");
    const source = document.createElement("article");
    const description = document.createElement("article");
    const video = document.createElement("iframe");
    const pTitle = document.createElement("p");
    const closeBtn = document.createElement("span");

    section.classList.add("card");
    section.classList.add("video-card");
    source.classList.add("source");
    description.classList.add("description");

    section.draggable = true;
    section.setAttribute("ondragstart", "drag(event)");
    section.setAttribute("ondrop", "drop(event)");
    section.setAttribute("ondragover", "allowDrop(event)");

    pTitle.classList.add("title");
    closeBtn.classList.add("close");

    video.src = this.url;
    video.setAttribute("frameborder", "0");
    video.setAttribute("allowfullscreen", "1");
    pTitle.textContent = this.title;
    closeBtn.textContent = "×";
    closeBtn.onclick = () => {
      if (elem.parentElement == null) {
        throw new Error("List parent is null");
      }
      deleteCard(this);
      repaint();
    };

    source.appendChild(video);
    description.appendChild(pTitle);
    section.appendChild(source);
    section.appendChild(description);
    section.appendChild(closeBtn);

    elem.append(section);
    return elem;
  }
}

const cards: Array<Card> = [];

/* Demo */
createCard(new NoteCard("Note Demo", "This is demo for note card"));
createCard(
  new ImageCard(
    "Image Demo",
    "https://files.realpython.com/media/random_data_watermark.576078a4008d.jpg"
  )
);
createCard(new ToDoCard("To Do Demo", "This is, demo for, To do, card"));
createCard(
  new VideoCard("Video Demo", "https://www.youtube.com/embed/4u856utdR94")
);
