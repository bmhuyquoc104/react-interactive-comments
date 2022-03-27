import React, { useState, useReducer, useContext } from "react";
import { StyledComment, StyledReply } from "./Comment.styled";
import CurrentUserComment from "./CurrentUserComment/CurrentUserComment";
import imagesResource from "../../assets/images";
import { StyledFlexContainer } from "../Flex/Flex.styled";
import {
  CommentContext,
  CommentIdContext,
  ReplyIdContext,
  TypeContext,
} from "../../hooks/useContext";
// Function to render a button and do a upvote and downvote function for that button
// Using the current score as the props from Comment component
const RenderButton = ({ score }) => {
  // Initiallize the state for the button
  const initialState = {
    currentVote: score,
    isPlusActive: false,
    isMinusActive: false,
  };

  // Function reducer for useReducer
  const voteReducer = (state, action) => {
    switch (action.type) {
      case "UPVOTEPLUS":
        return {
          currentVote: state.currentVote + 1,
          isPlusActive: state.isMinusActive ? false : true,
          isMinusActive: false,
        };
      case "UPVOTEMINUS":
        return {
          currentVote: state.currentVote - 1,
          isPlusActive: false,
          isMinusActive: state.isPlusActive ? false : true,
        };
      case "DOWNVOTEMINUS":
        return {
          currentVote: state.currentVote + 1,
          isPlusActive: false,
          isMinusActive: false,
        };
      case "DOWNVOTEPLUS":
        return {
          currentVote: state.currentVote - 1,
          isPlusActive: false,
          isMinusActive: false,
        };
      default:
        return state;
    }
  };

  // Use the useReducer hook to render the button and do the upvote and downvote function base on the current state
  const [voteState, dispatch] = useReducer(voteReducer, initialState);

  // Render the button base on the current state
  return (
    <div className="comment-button">
      {!voteState.isPlusActive ? (
        //  If the button is not active, render the plus button with the upvote function
        <button
          onClick={() => dispatch({ type: "UPVOTEPLUS" })}
          className="plus"
        >
          <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#C5C6EF"
              d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
            />
          </svg>
        </button>
      ) : (
        // If the button is active, render the plus button with the downvote function
        <button
          onClick={() => dispatch({ type: "DOWNVOTEPLUS" })}
          className="plus"
        >
          <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="hsl(238, 40%, 52%)"
              d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
            />
          </svg>
        </button>
      )}
      <div className="score">
        <p>{voteState.currentVote}</p>
      </div>
      {!voteState.isMinusActive ? (
        // If the button is not active, render the minus button with the upvoteMinus function
        <button
          onClick={() => dispatch({ type: "UPVOTEMINUS" })}
          className="minus"
        >
          <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#C5C6EF"
              d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
            />
          </svg>
        </button>
      ) : (
        // If the button is active, render the minus button with the downvoteMinus function
        <button
          onClick={() => dispatch({ type: "DOWNVOTEMINUS" })}
          className="minus"
        >
          <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="hsl(238, 40%, 52%)"
              d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const Comment = ({
  score,
  content,
  toggleModal,
  png,
  username,
  createdAt,
  replies,
  currentUser,
  id,
}) => {
  const [isReplyingComment, setReplyingComment] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [isReplyingAReply, setReplyingAReply] = useState(false);
  const { comments } = useContext(CommentContext);
  const { setCommentID } = useContext(CommentIdContext);
  const { replyID, setReplyID } = useContext(ReplyIdContext);
  const { type, setType } = useContext(TypeContext);

  return (
    <>
      {/* render only a comment without any replies */}
      {replies.length <= 0 ? (
        <>
          {/* render all the comments */}
          {currentUser.username === username ? (
            <StyledFlexContainer>
              <StyledComment>
                <RenderButton score={score} />

                <div className="comment-body">
                  <div className="comment-user">
                    <div className="left-side">
                      <div className="avatar">
                        <img src={png} alt="An user avatar" />
                      </div>
                      <h2>{username}</h2>
                      <h3 className="comment-owner">you</h3>
                      <h3>{createdAt}</h3>
                    </div>
                    <div className="reply-right-side">
                      <div className="delete-button">
                        <img
                          src={imagesResource.iconDelete}
                          alt="A delete icon"
                        />
                        <button
                          onClick={() => {
                            toggleModal(true);
                            setCommentID(id);
                            setType("deleteComment");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="edit-button">
                        <img src={imagesResource.iconEdit} alt="A edit icon" />
                        {/* a button to open the update box */}
                        <button
                          commentID={id}
                          onClick={() => {
                            setCommentID(id);
                            setUpdating(!isUpdating);
                            setType("updateComment");
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <p> {content}</p>
                  </div>
                </div>
                {/* open the update box for update the comment from current user */}
              </StyledComment>
              {isUpdating && (
                <CurrentUserComment
                  png={currentUser.image.png}
                  buttonRole="update"
                  replyId={replyID}
                  type={type}
                />
              )}
            </StyledFlexContainer>
          ) : (
            <StyledComment>
              <RenderButton score={score} />
              <div className="comment-body">
                <div className="comment-user">
                  <div className="left-side">
                    <div className="avatar">
                      <img src={png} alt="An user avatar" />
                    </div>
                    <h2>{username}</h2>
                    <h3>{createdAt}</h3>
                  </div>
                  <div className="right-side">
                    <img src={imagesResource.iconReply} alt="A reply icon" />
                    {/* open the reply box when click */}
                    <button
                      onClick={() => setReplyingComment(!isReplyingComment)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <div className="content">
                  <p>{content}</p>
                </div>
              </div>
            </StyledComment>
          )}

          {/* only open the reply box when reply is clicked */}
          {isReplyingComment && (
            <CurrentUserComment
              png={currentUser.image.png}
              buttonRole="reply"
            />
          )}
        </>
      ) : (
        // render all the comments with the replies
        <>
          <StyledComment>
            {/* comment button */}
            <RenderButton score={score} />

            {/* comment body */}
            <div className="comment-body">
              <div className="comment-user">
                <div className="left-side">
                  <div className="avatar">
                    <img src={png} alt="An user avatar" />
                  </div>
                  <h2>{username}</h2>
                  <h3>{createdAt}</h3>
                </div>
                <div className="right-side">
                  <img src={imagesResource.iconReply} alt="A reply icon" />
                  <button
                    onClick={() => {
                      setReplyingComment(!isReplyingComment);
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
              <div className="content">
                <p>{content}</p>
              </div>
            </div>
          </StyledComment>
          {/* render all replies from that comment  */}
          <StyledReply>
            <div className="decoration-container">
              <div className="decoration"></div>
            </div>
            <div className="replies">
              {replies.map((reply) =>
                currentUser.username !== reply.user.username ? (
                  <div key={reply.id}>
                    <StyledComment>
                      <RenderButton score={score} />

                      <div className="comment-body">
                        <div className="comment-user">
                          <div className="left-side">
                            <div className="avatar">
                              <img
                                src={reply.user.image.png}
                                alt="An user avatar"
                              />
                            </div>
                            <h2>{reply.user.username}</h2>
                            <h3>{reply.createdAt}</h3>
                          </div>
                          <div className="right-side">
                            <img
                              src={imagesResource.iconReply}
                              alt="A reply icon"
                            />
                            {/* open a reply box for each reply in a comment */}
                            <button
                              onClick={() => {
                                setReplyingAReply(!isReplyingAReply);
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                        <div className="content">
                          <p>
                            <span>@{reply.replyingTo}</span> {reply.content}
                          </p>
                        </div>
                      </div>
                    </StyledComment>
                    {/* render a reply box when the reply button is clicked */}
                    {isReplyingAReply && (
                      <CurrentUserComment
                        png={currentUser.image.png}
                        buttonRole="reply"
                        replyId={replyID}
                      />
                    )}
                  </div>
                ) : (
                  // render a reply from current user -> change the layout
                  <div key={reply.id}>
                    <StyledComment>
                      <RenderButton score={score} />

                      <div className="comment-body">
                        <div className="comment-user">
                          <div className="left-side">
                            <div className="avatar">
                              <img
                                src={reply.user.image.png}
                                alt="An user avatar"
                              />
                            </div>
                            <h2>{reply.user.username}</h2>
                            <h3 className="comment-owner">you</h3>
                            <h3>{reply.createdAt}</h3>
                          </div>
                          <div className="reply-right-side">
                            <div className="delete-button">
                              <img
                                src={imagesResource.iconDelete}
                                alt="A delete icon"
                              />
                              <button
                                onClick={() => {
                                  toggleModal(true);
                                  setType("deleteReply");
                                }}
                              >
                                Delete
                              </button>
                            </div>
                            <div className="edit-button">
                              <img
                                src={imagesResource.iconEdit}
                                alt="A edit icon"
                              />
                              {/* a button to open the update box */}
                              <button
                                onClick={() => {
                                  setUpdating(!isUpdating);
                                  setReplyID(reply.id);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="content">
                          <p>
                            {" "}
                            <span>@{reply.replyingTo}</span> {reply.content}
                          </p>
                        </div>
                      </div>
                    </StyledComment>
                    {/* open the update box for update the comment from current user */}
                    {isUpdating && (
                      <CurrentUserComment
                        png={currentUser.image.png}
                        buttonRole="update"
                        replyId={replyID}
                        type={type}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </StyledReply>
          {/* open the reply box for the comment that has reply */}
          {isReplyingComment && (
            <CurrentUserComment
              png={currentUser.image.png}
              buttonRole="reply"
            />
          )}
          {/* the box for current user to add new comment */}
        </>
      )}
    </>
  );
};

export default Comment;
