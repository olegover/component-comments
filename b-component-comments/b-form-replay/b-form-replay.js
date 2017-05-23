/**
 *@constructor
 *@extends bFormComment
 */
function bFormReplay() {
    this.div = document.createElement('div');
    this.div.className = 'b-form-comment';
    this.templateFormComment = '\
        <div class="b-form-comment__content">\
            <div class="b-form-comment__user-avatar"></div>\
            <div class="b-form-comment__text-field">\
                <label>Ответить на комментарий<br>\
                    <textarea rows="9" cols="60" name="fieldFormReplay"></textarea>\
                </label>\
            </div>\
            <div class="b-button b-button__text-comment">Отправить</div>\
        </div>';
}


/**
 *
 *@extends {bFormComment}
 */
bFormReplay.prototype = Object.create(bFormComment.prototype);
bFormReplay.prototype.constructor = bFormReplay;


/**
 * Css class enum
 * @enum {string}
 */
bFormReplay.CssClass = {
    ROOT: '.b-comment',
    TEXTAREA: 'textarea[name="fieldFormReplay"]'
};


/**
 * Handler on send button click
 */
bFormReplay.prototype.sendTextReplay = function() {
    this.fieldFormReplay =
        this.div.querySelector(bFormReplay.CssClass.TEXTAREA);
    this.button = this.div.querySelector(bButton.CssClass.BUTTON_TEXT_COMMENT);

    this.button.addEventListener('click', send, false);

    var self = this;
    function send(){
        var textComment = self.fieldFormReplay.value;
        if (isFieldFormCommentNotNull(textComment)) {

            var eventSendTextReplay = new Event('sendTextReplay', {
                bubbles: true});
            eventSendTextReplay.textComment = textComment;
            self.div.dispatchEvent(eventSendTextReplay);

            self.fieldFormReplay.value = '';
        } else {
            alert('Необходимо ввести текст сообщения');
        }
    }

    function isFieldFormCommentNotNull(textComment) {
        return (textComment.trim());
    }
};


/**
 *@override
 *@param {Object} event
 */
bFormReplay.prototype.render = function(event) {
    this.div.innerHTML = this.templateFormComment;
    var parentElement = event.target.parentElement;
    parentElement.insertAdjacentElement('afterEnd', this.div);
};


/**
 * Delete form replay
 */
bFormReplay.prototype.deleteForm = function(){
    this.button.addEventListener('click', removeForm, false);
    function removeForm(event){
        var parentElement = event.target.parentNode.parentNode;
        parentElement.remove();
    }
};
