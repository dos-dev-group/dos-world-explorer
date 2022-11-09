import UserCard from '@src/renderer/components/card/UserCard';
import { Grid } from '@src/renderer/components/styledComponents';
import { useFriendsData } from '@src/renderer/data/friends';
import { mqMinHeight, mqMinWidth, spacing } from '@src/renderer/utils/styling';
import useFriendsPage from './hooks/useFriendsPage';

function FriendsPage() {
  const hookMember = useFriendsPage();

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
      {hookMember.friends.map((friend) => (
        <UserCard
          key={friend.id}
          user={friend}
          css={{ overflowX: 'hidden' }}
          usersGroupNames={[]}
          allGroupNames={[]}
          onSetUsersGroup={(groupNames) =>
            hookMember.onSetUsersGroup(groupNames, friend)
          }
          onCreateGroup={(groupName) =>
            hookMember.onCreateGroup(groupName, friend)
          }
        />
      ))}
    </Grid>
  );
}
export default FriendsPage;
