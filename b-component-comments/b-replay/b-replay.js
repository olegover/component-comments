/**
 *@constructor
 *@param {text} string
 */
function bReplay(text) {
    this.textMessage = text || '';
    this.counterLikes  = 0;

    this.div = document.createElement('div');
    this.div.className = "b-comment b-comment_margin";
    this.templateReplay = '\
        <div class="comment__container">\
            <div class="comment__user-avatar"></div>\
            <div class="comment__text">' + this.textMessage + '</div>\
            <div class="comment__likes">\
                <img src="./icon/heart.png">\
            </div>\
            <div class="comment__count-likes comment__count-likes_hidden">'
    + this.counterLikes + '</div>\
        </div>';
    this.div.innerHTML = this.templateReplay;
}


/**
 * Css class enum
 * @enum {string}
 */
bReplay.CssClass = {
    ROOT: '.b-comment',
    LIKES: '.comment__likes',
    COUNT_LIKES: '.comment__count-likes',
    COUNT_LIKES_HIDDEN: 'comment__count-likes_hidden'
};


/**
 * Render replay block
 */
bReplay.prototype.render = function(event){
    var parentElement = event.target.parentNode;
    parentElement.insertAdjacentElement('beforeEnd', this.div);
};


/**
 * On comment likes click handler
 */
bReplay.prototype.liked = function() {
    this.commentLikes = this.div.querySelector(bReplay.CssClass.LIKES);
    this.countLikes = this.div.querySelector(bReplay.CssClass.COUNT_LIKES);
    this.commentLikes.addEventListener('click', countLikes, false);

    var self = this;
    function countLikes() {
        if (self.counterLikes == 0){
            self.countLikes.classList.remove(
                bReplay.CssClass.COUNT_LIKES_HIDDEN
            );
        }
        self.counterLikes++;
        self.countLikes.innerText = self.counterLikes;
    }
};
