'use strict';


function Component(){
    this.commentCounter = 0;
    this.commentsText = [];
}

Component.prototype.render = function(){
    this.div = document.createElement('div');
    this.div.className = 'component js-component';
    var templateComponentBody = '\
        <div class="component__header">\
            <span class="component__text"></span>\
            <span class="spanvmiddle"></span>\
        </div>';
    this.div.innerHTML = templateComponentBody;

    document.body.insertBefore(this.div, document.body.lastElementChild);
    this.componentHeader = this.div.querySelector('.component__text');


    var formComment = new FormComment();
    formComment.render();
    formComment.subscribe(component.insertComment.bind(component));
    formComment.takeTextComment();
};

Component.prototype.updateCommentsCounter = function(){
    this.commentCounter++;
    var self = this;
    function endingWord(){
        var words = ['комментариев', 'комментарий', 'комментария'];
        var result = 0;
        var remainder =  self.commentCounter % 100;
        if (remainder >= 10 && remainder <= 20)
            result = words[0];
        else {
            remainder = self.commentCounter % 10;
            if (remainder > 1 && remainder < 5)
                result = words[2];
            else if (remainder >= 5)
                result = words[0];
            else
                result = words[1];
        }

        return result;
    }

    this.componentHeader.innerHTML = this.commentCounter +' '+ endingWord();
};


Component.prototype.insertComment = function(comment){
    this.commentsText.push(comment);

    var arrayCommentsObjects = [];
    this.commentsText.forEach(function(element){
        arrayCommentsObjects.push(new Comment(element));
    });

    arrayCommentsObjects[arrayCommentsObjects.length-1].subscribe(this.updateCommentsCounter.bind(this));
    arrayCommentsObjects[arrayCommentsObjects.length-1].render();
    arrayCommentsObjects[arrayCommentsObjects.length-1].liked();
    arrayCommentsObjects[arrayCommentsObjects.length-1].reply();
};


function Replay(text, image){
    this.text = text;
    this._image = image || '';
    this.counterLikes  = 0;
    this.subscribers = [];
}

Replay.prototype.render = function(){
    //var self  = this;
    if (this._image){
        this._image = 'comment__image--authorized'
    } else  this._image = 'comment__image--no-authorized';
    this.div = document.createElement('div');
    this.div.className = "comments-container";
    var templateReplay = '\
    <div class="comment comment--margin">\
        <div class="comment__image '+ this._image +'"></div>\
        <div class="comment__field">'+ this.text +'</div>\
        <div class="comment__likes">like</div>\
        <div class="comment__count-likes comment__count-likes--hidden">'+ this.counterLikes+'</div>\
    </div>';
    this.div.innerHTML = templateReplay;

    var parentElement = event.target.parentNode.parentNode;
    parentElement.insertBefore(this.div, parentElement.lastElementChild);

    this.subscribers.forEach(function(subscriber){
        subscriber();
    });
};

Replay.prototype.liked = function(){
    this.heart = this.div.querySelector('.comment__likes');
    this.blockLikes = this.div.querySelector('.comment__count-likes');
    this.heart.addEventListener('click', countLikes, false);

    var self = this;
    function countLikes() {
        if (self.counterLikes == 0){
            self.blockLikes.style.visibility = 'visible';
        }
        self.counterLikes++;
        self.blockLikes.innerText = self.counterLikes;
    }
};

Replay.prototype.subscribe = function(onPublish){
    this.subscribers.push(onPublish);
};


function Comment(){
    Replay.apply(this, arguments);
    this.replays = [];
}

Comment.prototype = Object.create(Replay.prototype);
Comment.prototype.constructor = Comment;


Comment.prototype.insert = function(textReplay){
    this.replays.push(textReplay);
    var arrayReplaysObject = [];
    this.replays.forEach(function(element){
        arrayReplaysObject.push(new Replay(element));
    });

    arrayReplaysObject[arrayReplaysObject.length-1].subscribe(component.updateCommentsCounter.bind(component));
    arrayReplaysObject[arrayReplaysObject.length-1].render();
    arrayReplaysObject[arrayReplaysObject.length-1].liked();
};

Comment.prototype.render = function(){
    Replay.prototype.render.apply(this, arguments);
    this.div.children[0].classList.remove('comment--margin');
    var field = document.createElement('div');
    field.className = "button-add button-add__underscore";
    this.div.children[0].insertBefore(field, this.div.children.lastElementChild);
    this.field = this.div.querySelector('.button-add').innerText = 'Ответить';
};

Comment.prototype.reply = function(){
    var self = this;
    this.button = this.div.querySelector('.button-add__underscore');
    this.button.addEventListener('click', callFormReply, false);

    function callFormReply(event) {
        // проверить создан ли объект
        if (!self.div.querySelector('.form-comment')) {
            var form = new FormReplay();
            form.render(event);
            form.subscribe(self.insert.bind(self));
            form.takeTextComment();
            form.deleteForm();
        }
    }
};


function FormComment(image){
    this.text = '';
    this.image = image || '';
    this.subscribers = [];
}

FormComment.prototype.render = function(){
    this.div = document.createElement('div');
    this.div.className = 'form-comment           js-form-comment';
    var templateReplay = '\
        <div class="comment__image comment__image--no-authorized"></div>\
            <div class="comment__field form-comment__field--big">\
                <label>Добавить комментарий<br>\
                    <textarea rows="9" cols="60" name="message"></textarea>\
                </label>\
            </div>\
        <div class="button-add button-add__new-comment">Отправить</div>';

    this.div.innerHTML = templateReplay;

    //
    var parentElement = document.body.children[0];
    parentElement.insertAdjacentElement('beforeEnd', this.div);


};

FormComment.prototype.takeTextComment = function(){
    this.field = this.div.querySelector('textarea[name="message"]');
    this.button = this.div.querySelector('.button-add__new-comment');
    this.button.addEventListener('click', send, false);
    var self = this;
    function send(){
        if (self.field.value.trim()) {
            self.text = self.field.value;
            self.field.value = '';
            self.subscribers.forEach(function(subscriber){
                subscriber(self.text, self.image);
            });
        } else alert('Введите текст сообщения');
    }
};

FormComment.prototype.subscribe = function(onPublish){
    this.subscribers.push(onPublish);
};


function FormReplay(){
    FormComment.apply(this, arguments);
}

FormReplay.prototype = Object.create(FormComment.prototype);
FormReplay.prototype.constructor = FormReplay;

FormReplay.prototype.render = function(event){
    this.div = document.createElement('div');
    this.div.className = 'form-comment           js-form-comment';
    var templateReplay = '\
        <div class="comment__image comment__image--no-authorized"></div>\
            <div class="comment__field form-comment__field--big">\
                <label>Добавить ответ на комментарий<br>\
                    <textarea rows="9" cols="60" name="message"></textarea>\
                </label>\
            </div>\
        <div class="button-add button-add__new-comment">Отправить</div>';

    this.div.innerHTML = templateReplay;

    // if pressed on "Ответить"
    var parentElement = event.target.parentNode.parentNode;
    parentElement.insertAdjacentElement('beforeEnd', this.div);
};

FormReplay.prototype.deleteForm = function(){
    this.button.addEventListener('click', removeForm, false);
    function removeForm(event){
        var parentElement = event.target.parentNode;
        parentElement.remove();
    }
};


//realization
var component = new Component();
component.render();



function Visual() {
    alert('123');
    innerHTML();
};

Visual();