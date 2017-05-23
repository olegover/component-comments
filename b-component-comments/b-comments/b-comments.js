/**
 *@constructor
 * @param {element} domContainer
 */
function bComments(domContainer){
    this.commentCounter = 0;
    this.commentsText = [];
    this.domContainer = domContainer;

    this.div = document.createElement('div');
    this.div.className = 'b-comments';
    var templateCommentsBody = '\
        <div class="b-comments__header">\
            <span class="b-comments__counter"></span>\
            <span class="b-comments__centerer"></span>\
        </div>\
        <div class="b-comments__contents"></div>\
        </div>';
    this.div.innerHTML = templateCommentsBody;
}


/**
 * Css class enum
 * @enum {string}
 */
bComments.CssClass = {
    ROOT: '.b-comments',
    COMMENTS_COUNTER: '.b-comments__counter',
    COMMENTS_CONTENTS: '.b-comments__contents'
};


/**
 * Render block comments
 */
bComments.prototype.render = function(){
    this.domContainer.insertBefore(this.div, this.domContainer.lastElementChild);
    this.insertFormComment();

    this.handlerSendTextComment();
    this.handlerInsertComment();

};


/**
 * Instances block form comment
 */
bComments.prototype.insertFormComment = function() {
    var domContainer = this.domContainer;
    var formComment = new bFormComment();
    formComment.render(domContainer);
    formComment.sendTextComment();
};


/**
 * Handler comment insert
 */
bComments.prototype.handlerInsertComment = function() {
    var self = this;
    this.div.addEventListener('insertComment', function() {
        self.updateCommentsCounter();
    });
};


/**
 * Update counter comments
 */
bComments.prototype.updateCommentsCounter = function(){
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

    this.commentsHeader = this.div.querySelector(
        bComments.CssClass.COMMENTS_COUNTER
    );
    this.commentsHeader.innerHTML = this.commentCounter +' '+ endingWord();
};


/**
 * Handler send text comment event
 *@param {Object} event
 */
bComments.prototype.handlerSendTextComment = function(event) {
    var self = this;
    this.div.addEventListener('sendTextComment', function (event) {
        self.commentsText.push(event.textComment);
        self.insertComment(event);
    });
};


/**
 * Insert comment
 *@param {Object} event
 */
bComments.prototype.insertComment = function(event) {
    var comment = new bComment(event.textComment);
    comment.render(event);
    comment.liked();
    comment.onReplayClick();
    comment.handlerSendTextReplay();

    this.div.dispatchEvent(new Event('insertComment', {
            bubbles: true})
    );
};

var divOne = document.body.querySelector('.componentCommentOne');
var divTwo = document.body.querySelector('.componentCommentTwo');

var comments = new bComments(divOne);
comments.render();



var comments2 = new bComments(divTwo);
comments2.render();
