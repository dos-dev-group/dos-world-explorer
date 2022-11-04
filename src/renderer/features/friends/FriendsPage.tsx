import UserCard from '@src/renderer/components/card/UserCard';
import { Grid } from '@src/renderer/components/styledComponents';
import { useFriends } from '@src/renderer/data/friends';

function FriendsPage() {
  const { friends, refresh } = useFriends();

  return <Grid></Grid>;

  return <UserCard user={friends[0]} />;
}
export default FriendsPage;
