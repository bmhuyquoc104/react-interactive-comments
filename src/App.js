import { StyledGlobal } from "./Global.styled";
import { StyledFlexContainer } from "./components/Flex/Flex.styled";
import Comment from "./components/Comment/Comment.jsx";
import { content } from "./assets/content";
import Modal  from "./components/Comment/Modal/Modal.jsx";
import {useState,useEffect} from 'react'
import {CommentContext, CommentIdContext} from './hooks/useContext'
import CurrentUserComment from "./components/Comment/CurrentUserComment/CurrentUserComment";
function App() {

  // Use state hook to store the comments
  const [comments,setComments] = useState(()=>{
    // Get the value from localStorage
    const localData = localStorage.getItem('comments');
    // If the localStorage is empty -> render by the default array
    return localData ? JSON.parse(localData) : content.comments;
  });


  const [commentID,setCommentID] = useState();

  // Use useEffect hook to save the comments to localStorage and only re render when the comments arr change
  useEffect(() => {
    // Set the item to the localStorage
    localStorage.setItem('comments',JSON.stringify(comments))
  },[comments])

  // Use to remove the localstorage
  // localStorage.removeItem('comments');

  // Initialize the empty arr to push all the replies to this arr
  let replyComment = [];
  comments.forEach(comment => {
    let eachReply = comment.replies;
    replyComment.push(eachReply);
    
  })

  const [reply,setReply] = useState((replyComment[1]));


  // use state hook to toggle the modal
  const [isToggle, setToggle] = useState(false);
  return (
    <>
      {/* Add the global style on top  */}
      <StyledGlobal />
      {/* Wrap the children by useContext.provider and pass the value */}
      <CommentIdContext.Provider value={{setCommentID}}>
      <CommentContext.Provider value = {{comments,setComments}}>
      <StyledFlexContainer>
            {comments.map((comment) => (
              <Comment key = {comment.id} id = {comment.id} toggleModal = {setToggle}  content = {comment.content} score = {comment.score} createdAt = {comment.createdAt} username = {comment.user.username} png = {comment.user.image.png} replies ={comment.replies} currentUser = {content.currentUser} />
            ))}
            <CurrentUserComment
        currentUser={content.currentUser}
        png={content.currentUser.image.png}
        buttonRole="send"
      />
      </StyledFlexContainer>
      {/* Show the modal whether it is toggle or not */}
      {isToggle && <Modal id ={commentID} toggleModal = {setToggle}/>}
      </CommentContext.Provider>
      </CommentIdContext.Provider>
    </>
  );
}

export default App;
