import React, { Component } from 'react';
import { CSSTransition }  from 'react-transition-group';

//TODO 背景画像の選択
//TODO 切断
class CommentWindow extends Component {
  constructor() {
    super();
    this.youtubeUtil = window.youtubeUtil;
    this.video_id = '';
    this.state = { comments: [], animation: false };
  }

  componentDidMount() {
    const VIDEO_ID = process.env.YOUTUBE_INIT_VIDEO_ID;
    document.getElementById('play').addEventListener('click', () =>{
      if(document.getElementById('search-box').value.length !== 0 && navigator.onLine){
        this.setState({ comments: [], animation: false });
        this.commentChange();
      }
    }, false);
    this.connectComment(VIDEO_ID);
    document.getElementById('reload').addEventListener('click', () => {
      this.commentReload();
    }, false);
  }

  componentDidUpdate(){
    const cw = document.getElementsByClassName('comment-wrap')[0];
    cw.scrollTop = cw.scrollHeight;
  }

  commentChange() {
    this.video_id = document.getElementById('search-box').value;
    this.youtubeUtil.stopComment();
    this.connectComment(this.video_id);
  }

  commentReload() {
    this.youtubeUtil.stopComment();
    this.connectComment(this.video_id);
  }

  connectComment(video_id) {
    this.youtubeUtil.connectChat(video_id, (chatId) => {
      this.youtubeUtil.connectComment(chatId, (comments) => {
        if(comments.length !== 0) {
          Array.prototype.push.apply(this.state.comments, comments);
          this.setState({
            comments: this.state.comments.slice(this.state.comments.length - 200, this.state.comments.length),
            animation: !this.state.animation
          });
        }
      });
    }, (title) => {
      /* titleの更新 */
      const titleElm = document.getElementById('video-title');
      if(titleElm.textContent !== title) { titleElm.textContent = title; }
    });
  }

  render() {
    const displayComment = this.state.comments.length === 0 ? ["コメントがありません"] : this.state.comments;
    return (
      <div>
        <p className="comment-header">コメント</p>
        <div className="comment-wrap">
          <CSSTransition in={this.state.animation} classNames="fade" timeout={1000}>
            <div>{ displayComment.map((c,k) => <p className="comment" key={k}>{c}</p>) }</div>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

export default CommentWindow;
