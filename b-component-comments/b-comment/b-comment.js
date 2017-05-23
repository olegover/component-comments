/**
 *@constructor
 *@param {text} string
 */
function bComment(text) {
    bReplay.apply(this, arguments);
    this.replays = [];

    this.div.classList.remove('b-comment_margin');
    var button = document.createElement('div');
    button.className = "b-button b-button__underscore";
    this.div.children[0].insertBefore(button,
        this.div.children.lastElementChild);

    this.button = this.div.querySelector('.b-button');
    this.button.innerText = 'Ответить';
}

/**
 *@extends {bReplay}
 */
bComment.prototype = Object.create(bReplay.prototype);
bComment.prototype.constructor = bComment;


/**
 * On button replay handler
 */
bComment.prototype.onReplayClick = function() {
    this.button.addEventListener('click', initFormReply, false);

    var self = this;
    function initFormReply(event) {
        if (!self.div.querySelector('.b-form-comment')) {
            var formReplay = new bFormReplay();
            formReplay.render(event);
            formReplay.sendTextReplay();
            formReplay.deleteForm();
        }
    }
};


/**
 * Render comment block
 *@override
 */
bComment.prototype.render = function(event){
    var parentElement = event.target.parentNode;
    parentElement.insertBefore(this.div, parentElement.lastElementChild);
};


/**
 * Handler text replay send
 * @param {Object} event
 */
bComment.prototype.handlerSendTextReplay = function(event) {
    var self = this;
    this.div.addEventListener('sendTextReplay', function(event) {
        self.replays.push(event.textComment);
        self.insertReplay(event);
    });
};


/**
 * Inserts replay
 */
bComment.prototype.insertReplay = function(event) {
    var replay = new bReplay(event.textComment);
    replay.render(event);
    replay.liked();

    this.actionInsertReplay();
};


/**
 * Dispatch insert replay
 */
bComment.prototype.actionInsertReplay = function() {
    var eventInsertReplay = new Event('insertComment', {
        bubbles: true});
    this.div.dispatchEvent(eventInsertReplay);
};