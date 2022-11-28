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
import { Button, Collapse, Input, Pagination, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { User } from 'vrchat';
import useFriendsPage from './hooks/useFriendsPage';

function FriendsPage() {
  const hookMember = useFriendsPage();
  const [groupModalData, setGroupModalData] = useState<User>();

  const renderedFriends = hookMember.partialFriends?.map((friend) => (
    <UserCard
      key={friend.id}
      user={friend}
      css={{ overflowX: 'hidden' }}
      usersGroupNames={hookMember.findUserGroups(friend.id)}
      onClickGroupEdit={() => setGroupModalData(friend)}
    />
  ));

  return (
    <Flex>
      <PartySelectModal
        open={groupModalData ? true : false}
        allGroups={
          hookMember.partyGroup ? Object.keys(hookMember.partyGroup) : []
        }
        userGroups={
          groupModalData ? hookMember.findUserGroups(groupModalData.id) : []
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
            alignItems: 'end',
            marginBottom: spacing(1),
          }}
        >
          <Input.Search
            placeholder="검색어를 입력하세요"
            allowClear
            onSearch={hookMember.onSearchInput}
            css={{
              marginRight: spacing(10),
            }}
            loading={!renderedFriends}
          />
          <Button
            css={{ marginLeft: 'auto' }}
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => hookMember.onClickRefresh()}
            loading={!renderedFriends}
          />
        </FlexRow>

        <Collapse activeKey={['all']}>
          <Collapse.Panel
            key="all"
            header={`Friends (${hookMember.friendsLength})`}
          >
            {renderedFriends ? (
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
            ) : (
              <FlexCenter css={{ width: '100%', height: '100%' }}>
                <Spin />
              </FlexCenter>
            )}
          </Collapse.Panel>
        </Collapse>
        <FlexRow css={{ marginTop: spacing(2) }}>
          <Pagination
            css={{ marginLeft: 'auto' }}
            total={hookMember.friendsLength}
            showTotal={(total, range) => `${range[0]} - ${range[1]} (${total})`}
            showSizeChanger={false}
            current={hookMember.currentPage}
            pageSize={hookMember.pageSize}
            onChange={hookMember.onChangePage}
          />
        </FlexRow>
      </Flex>
    </Flex>
  );
}
export default FriendsPage;
