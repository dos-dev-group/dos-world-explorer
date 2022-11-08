import UserCard from '@src/renderer/components/card/UserCard';
import { Grid } from '@src/renderer/components/styledComponents';
import { useFriends } from '@src/renderer/data/friends';
import { mqMinHeight, mqMinWidth, spacing } from '@src/renderer/utils/styling';

function FriendsPage() {
  const { friends, refresh } = useFriends();

  return (
    <Grid
      css={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        // gridAutoColumns: 'minmax(100px, 1fr)',
        gridAutoRows: 150,
        gap: spacing(1),
        padding: spacing(1),
        [mqMinWidth(1200)]: {
          gridTemplateColumns: 'repeat(4, 1fr)',
        },
      }}
    >
      {friends.map((friend) => (
        <UserCard key={friend.id} user={friend} css={{ overflowX: 'hidden' }} />
      ))}
    </Grid>
  );
}
export default FriendsPage;
