/**
 * Form comment
 *@constructor
 *@type {this.div} element
 */
function bFormComment() {
    this.div = document.createElement('div');
    this.div.className = 'b-form-comment';
    this.templateFormComment = '\
        <div class="b-form-comment__content">\
            <div class="b-form-comment__user-avatar"></div>\
            <div class="b-form-comment__text-field">\
                <label>Добавить комментарий<br>\
                    <textarea rows="9" cols="60" name="fieldFormComment"></textarea>\
                </label>\
            </div>\
            <div class="b-button b-button__text-comment">Отправить</div>\
        </div>';
}


/**
 * Css class enum
 * @enum {string}
 */
bFormComment.CssClass = {
    ROOT: '.b-form-comment',
    TEXTAREA: 'textarea[name="fieldFormComment"]'
};


/**
 *Render form comment on page
 *@param {element} domElement
 */
bFormComment.prototype.render = function(domElement) {
    this.div.innerHTML = this.templateFormComment;

    var parentElement = domElement.querySelector(
        bComments.CssClass.COMMENTS_CONTENTS
    );
    parentElement.insertAdjacentElement('beforeEnd', this.div);
};


/**
 * On send button click handler
 */
bFormComment.prototype.sendTextComment = function() {
    this.fieldFormComment =
        this.div.querySelector(bFormComment.CssClass.TEXTAREA);
    this.button = this.div.querySelector(bButton.CssClass.BUTTON_TEXT_COMMENT);

    this.button.addEventListener('click', send, false);

    var self = this;
    function send(){
        var textComment = self.fieldFormComment.value;
        if (isFieldFormCommentNotNull(textComment)) {
            var eventSendTextComment = new Event('sendTextComment', {
                bubbles: true});
            eventSendTextComment.textComment = textComment;
            self.div.dispatchEvent(eventSendTextComment);

            self.fieldFormComment.value = '';
        } else {
            alert('Необходимо ввести текст сообщения');
        }
    }

    function isFieldFormCommentNotNull(textComment) {
        if (textComment.trim()) {
            return true;
        }
        return false;
    }
};