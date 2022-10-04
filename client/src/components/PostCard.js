import React, { useContext } from "react";
import { Card,Image,Button, Icon, Label, Popup} from 'semantic-ui-react';
import { Link } from "react-router-dom";
import moment from 'moment'

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

const PostCard = ({post:{body, createdAt, id, username, likeCount, commentCount, likes}}) => {

  const { user } = useContext(AuthContext)

return (
<Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header as={Link} to={`/posts/${id}`}>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>

        <LikeButton user={user} post={{id , likes, likeCount}}/>
        <Popup content="Comment on post" inverted trigger={
              <Button as='div' labelPosition='right' >
              <Button color='blue' basic as={Link} to={`/posts/${id}`}>
                <Icon name="comments" />
              </Button>
              <Label as='a' basic color='blue' pointing='left'>
                {commentCount}
              </Label>
            </Button>
        }/>
    {user && user.username === username && (<DeleteButton postId={id} />)}
    
      </Card.Content>
    </Card>
)
}

export default PostCard;