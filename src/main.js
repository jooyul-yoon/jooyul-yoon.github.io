/* Body */
var body = document.querySelector("body");
var contents = document.querySelector("ul");
/* Navigation */
var imgBtn = document.querySelector("#imgBtn");
var videoBtn = document.querySelector("#videoBtn");
var noteBtn = document.querySelector("#noteBtn");
var todoBtn = document.querySelector("#todoBtn");
/* Modal */
var modal = document.querySelector(".modal");
var modalContent = document.querySelector(".modal-content");
var titleInput = document.querySelector("#modal-title");
var submit = document.querySelector("#modal-return");
var contentInput = document.querySelector("#modal-content");
var pTitle = titleInput.querySelector("p");
var inputTitle = titleInput.querySelector("input");
var pContent = contentInput.querySelector("p");
var inputContent = contentInput.querySelector("input");
submit.textContent = "Return";
pTitle.textContent = "Title";
inputTitle.setAttribute("placeholder", "Title");
var inputInvalid = function () {
    if (inputTitle.value.length <= 0 || inputContent.value.length <= 0) {
        alert("Please enter a valid input");
        return true;
    }
    return false;
};
// When the user clicks the button, open the modal
imgBtn.onclick = function () {
    pContent.textContent = "URL";
    inputContent.setAttribute("placeholder", "image url");
    modal.style.display = "block";
    submit.onclick = function () {
        if (inputInvalid())
            return;
        createCard(new ImageCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
videoBtn.onclick = function () {
    pContent.textContent = "URL";
    inputContent.setAttribute("placeholder", "video url");
    modal.style.display = "block";
    submit.onclick = function () {
        if (inputInvalid())
            return;
        createCard(new VideoCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
noteBtn.onclick = function () {
    pContent.textContent = "Note";
    inputContent.setAttribute("placeholder", "note");
    modal.style.display = "block";
    submit.onclick = function () {
        if (inputInvalid())
            return;
        createCard(new NoteCard(inputTitle.value, inputContent.value));
        inputTitle.value = "";
        inputContent.value = "";
        modal.style.display = "none";
    };
};
todoBtn.onclick = function () {
    pContent.textContent = "Tasks";
    inputContent.setAttribute("placeholder", "sperated by ,");
    modal.style.display = "block";
    submit.onclick = function () {
        if (inputInvalid())
            return;
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
function allowDrop(e) {
    e.preventDefault();
}
function drag(e) {
    var _a;
    var elem = e.target;
    if (elem == null)
        throw new Error("Start element is null");
    if (elem.parentElement == null)
        throw new Error("From element's parent is null");
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", getIndex(elem.parentElement));
}
function drop(e) {
    var elemTo = e.target;
    if (e.dataTransfer == null)
        throw new Error("Data transfer is null");
    if (elemTo == null)
        throw new Error("Start element is null");
    if (elemTo.parentElement == null)
        throw new Error("From element's parent is null");
    var elemFromIndex = parseInt(e.dataTransfer.getData("text"));
    var elemToIndex = parseInt(getIndex(elemTo.parentElement));
    swapCard(cards, elemFromIndex, elemToIndex);
    repaint();
}
var getIndex = function (elem) {
    if (elem == null)
        throw new Error("This element is null");
    if (elem.parentElement == null)
        throw new Error("Parent Node is null");
    while (elem.parentElement != contents) {
        elem = elem.parentElement;
    }
    for (var i = 0; i < contents.childNodes.length; i++) {
        if (contents.childNodes[i] == elem)
            return i.toString();
    }
    throw new Error("this element does not exist");
};
var swapCard = function (cards, elemFromIndex, elemToIndex) {
    if (elemFromIndex > elemToIndex) {
        cards.splice(elemToIndex, 0, cards[elemFromIndex]);
        cards.splice(elemFromIndex + 1, 1);
    }
    else {
        cards.splice(elemToIndex + 1, 0, cards[elemFromIndex]);
        cards.splice(elemFromIndex, 1);
    }
};
/* Create Card */
var createCard = function (newCard) {
    cards.push(newCard);
    repaint();
};
var repaint = function () {
    contents.innerHTML = "";
    cards.forEach(function (card) {
        var cardElement = card.createElement();
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
var deleteCard = function (cardToDelete) {
    cards.splice(cards.indexOf(cardToDelete), 1);
};
var NoteCard = /** @class */ (function () {
    function NoteCard(_title, _note) {
        this._title = _title;
        this._note = _note;
    }
    Object.defineProperty(NoteCard.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NoteCard.prototype, "note", {
        get: function () {
            return this._note;
        },
        enumerable: false,
        configurable: true
    });
    NoteCard.prototype.createElement = function () {
        var _this = this;
        var elem = document.createElement("li");
        var section = document.createElement("section");
        var article = document.createElement("article");
        var closeBtn = document.createElement("span");
        var pTitle = document.createElement("p");
        var pNote = document.createElement("p");
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
        closeBtn.onclick = function () {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(_this);
            repaint();
        };
        article.appendChild(pTitle);
        article.appendChild(pNote);
        section.appendChild(article);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    };
    return NoteCard;
}());
var ToDoCard = /** @class */ (function () {
    function ToDoCard(_title, _tasks) {
        this._title = _title;
        this.tasks = _tasks.split(",");
    }
    Object.defineProperty(ToDoCard.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    ToDoCard.prototype.createElement = function () {
        var _this = this;
        var elem = document.createElement("li");
        var section = document.createElement("section");
        var article = document.createElement("article");
        var closeBtn = document.createElement("span");
        var pTitle = document.createElement("p");
        var pToDo = document.createElement("p");
        section.classList.add("card");
        closeBtn.classList.add("close");
        pTitle.classList.add("title");
        pToDo.classList.add("toDo");
        section.draggable = true;
        section.setAttribute("ondragstart", "drag(event)");
        section.setAttribute("ondrop", "drop(event)");
        section.setAttribute("ondragover", "allowDrop(event)");
        pTitle.textContent = this._title;
        this.tasks.forEach(function (task) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.onclick = function () {
                if (input.checked)
                    label.classList.add("strikethrough");
                else
                    label.classList.remove("strikethrough");
            };
            label.appendChild(input);
            label.appendChild(document.createTextNode(" " + task));
            pToDo.appendChild(label);
            pToDo.appendChild(document.createElement("br"));
        });
        closeBtn.textContent = "×";
        closeBtn.onclick = function () {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(_this);
            repaint();
        };
        article.appendChild(pTitle);
        article.appendChild(pToDo);
        section.appendChild(article);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    };
    return ToDoCard;
}());
var ImageCard = /** @class */ (function () {
    function ImageCard(_title, url) {
        this._title = _title;
        this.url = url;
    }
    Object.defineProperty(ImageCard.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    ImageCard.prototype.createElement = function () {
        var _this = this;
        var elem = document.createElement("li");
        var section = document.createElement("section");
        var source = document.createElement("article");
        var description = document.createElement("article");
        var image = document.createElement("img");
        var pTitle = document.createElement("p");
        var closeBtn = document.createElement("span");
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
        closeBtn.onclick = function () {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(_this);
            repaint();
        };
        source.appendChild(image);
        description.appendChild(pTitle);
        section.appendChild(source);
        section.appendChild(description);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    };
    return ImageCard;
}());
var VideoCard = /** @class */ (function () {
    function VideoCard(_title, url) {
        this._title = _title;
        this.url = url;
    }
    Object.defineProperty(VideoCard.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: false,
        configurable: true
    });
    VideoCard.prototype.createElement = function () {
        var _this = this;
        var elem = document.createElement("li");
        var section = document.createElement("section");
        var source = document.createElement("article");
        var description = document.createElement("article");
        var video = document.createElement("iframe");
        var pTitle = document.createElement("p");
        var closeBtn = document.createElement("span");
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
        closeBtn.onclick = function () {
            if (elem.parentElement == null) {
                throw new Error("List parent is null");
            }
            deleteCard(_this);
            repaint();
        };
        source.appendChild(video);
        description.appendChild(pTitle);
        section.appendChild(source);
        section.appendChild(description);
        section.appendChild(closeBtn);
        elem.append(section);
        return elem;
    };
    return VideoCard;
}());
var cards = [];
/* Demo */
createCard(new NoteCard("Note Demo", "This is demo for note card"));
createCard(new ImageCard("Image Demo", "https://files.realpython.com/media/random_data_watermark.576078a4008d.jpg"));
createCard(new ToDoCard("To Do Demo", "This is, demo for, To do, card"));
createCard(new VideoCard("Video Demo", "https://www.youtube.com/embed/4u856utdR94"));
