import { ReloadOutlined } from '@ant-design/icons';
import UserCard from '@src/renderer/components/card/UserCard';
import PartySelectModal from '@src/renderer/components/PartySelectModal';
import {
  Flex,
  FlexCenter,
  FlexRow,
  Grid,
} from '@src/renderer/components/styledComponents';
import { useFriendsData } from '@src/renderer/data/friends';
import { mqMinHeight, mqMinWidth, spacing } from '@src/renderer/utils/styling';
import { Button, Collapse, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { User } from 'vrchat';
import useFriendsPage from './hooks/useFriendsPage';

function FriendsPage() {
  const hookMember = useFriendsPage();
  const [groupModalData, setGroupModalData] = useState<User>();

  const renderedFriends = hookMember.friends?.map((friend) => (
    <UserCard
      key={friend.id}
      user={friend}
      css={{ overflowX: 'hidden' }}
      usersGroupNames={hookMember.checkUserGroups(friend.id)}
      onClickGroupEdit={() => setGroupModalData(friend)}
    />
  ));
  const numFriends = hookMember.friends?.length || 0;

  return (
    <Flex>
      <PartySelectModal
        open={groupModalData ? true : false}
        allGroups={
          hookMember.partyGroup ? Object.keys(hookMember.partyGroup) : []
        }
        userGroups={
          groupModalData ? hookMember.checkUserGroups(groupModalData.id) : []
        }
        onOk={(groupNames) => {
          if (!groupModalData) return;

          hookMember.onSetUsersGroup(groupNames, groupModalData);
          setGroupModalData(undefined);
        }}
        onCancel={() => setGroupModalData(undefined)}
        onCreateGroup={(groupName) => hookMember.onCreateGroup(groupName)}
      />

      <Flex css={{ margin: spacing(2) }}>
        <FlexRow
          css={{
            marginLeft: 'auto',
            alignItems: 'center',
            marginBottom: spacing(1),
          }}
        >
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => hookMember.onClickRefresh()}
            loading={!renderedFriends}
          />
        </FlexRow>
        {renderedFriends ? (
          <Collapse activeKey={['all']}>
            <Collapse.Panel key="all" header={`Friends (${numFriends})`}>
              <Grid
                css={{
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  // gridAutoColumns: 'minmax(100px, 1fr)',
                  gridAutoRows: 150,
                  gap: spacing(1),
                  [mqMinWidth(1200)]: {
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  },
                }}
              >
                {renderedFriends}
              </Grid>
            </Collapse.Panel>
          </Collapse>
        ) : (
          <FlexCenter css={{ width: '100%', height: '100%' }}>
            <Spin />
          </FlexCenter>
        )}
      </Flex>
    </Flex>
  );
}
export default FriendsPage;
