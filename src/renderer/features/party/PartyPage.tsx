import {
  DownloadOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
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
import { Button, Collapse, Dropdown, Menu, Spin } from 'antd';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { User } from 'vrchat';
import usePartyPage from './hooks/usePartyPage';
import PartyGroupModal from './PartyGroupModal';

function PartyPage() {
  const hookMember = usePartyPage();
  const [groupModalData, setGroupModalData] = useState<User>();
  const [isOpenPartyModal, setIsOpenPartyModal] = useState(false);

  // const renderedFriends = hookMember.friends?.map((friend) => (
  //   <UserCard
  //     key={friend.id}
  //     user={friend}
  //     css={{ overflowX: 'hidden' }}
  //     usersGroupNames={hookMember.checkUserGroups(friend.id)}
  //     onClickGroupEdit={() => setGroupModalData(friend)}
  //   />
  // ));

  const renderedGroupPanels =
    hookMember.partyGroup &&
    Object.keys(hookMember.partyGroup).map((gName) => {
      const renderedUsers = hookMember.partyGroup![gName].map((memberUser) => (
        <UserCard
          key={memberUser.id}
          user={memberUser}
          usersGroupNames={hookMember.findUserGroups(memberUser.id)}
          onClickGroupEdit={() => setGroupModalData(memberUser)}
        />
      ));

      return (
        <Collapse.Panel
          header={`${gName} (${hookMember.partyGroup![gName].length})`}
          key={gName}
          collapsible={
            hookMember.partyGroup![gName].length > 0 ? 'header' : 'disabled'
          }
        >
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
            {renderedUsers}
          </Grid>
        </Collapse.Panel>
      );
    });

  const defaultOpenGroups = hookMember.partyGroup
    ? Object.keys(hookMember.partyGroup).filter(
        (groupName) => (hookMember.partyGroup?.[groupName].length || 0) > 0,
      )
    : [];

  return (
    <Flex css={{ margin: spacing(2) }}>
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
      <PartyGroupModal
        onAddItem={(type: string): void => {
          hookMember.onCreateGroup(type);
        }}
        onEditItem={(type: string, newType: string): void => {
          hookMember.onRenameGroup(type, newType);
        }}
        onRemoveItem={(type: string): void => {
          hookMember.onRemoveGroup(type);
        }}
        onCancel={(): void => {
          setIsOpenPartyModal(false);
        }}
        partyGroup={hookMember.partyGroup}
        open={isOpenPartyModal}
      />

      <FlexRow
        css={{
          marginLeft: 'auto',
          marginBottom: spacing(1),
          alignItems: 'flex-end',
        }}
      >
        <Button
          size="middle"
          icon={<ReloadOutlined />}
          onClick={() => hookMember.onClickRefresh()}
          loading={!hookMember.partyGroup}
        />

        <Dropdown.Button
          onClick={() => setIsOpenPartyModal(true)}
          overlay={
            <Menu
              items={[
                {
                  label: '파티 내보내기',
                  key: '1',
                  icon: <UploadOutlined />,
                  onClick: () => hookMember.onClickOpenSaveDialog(),
                },
                {
                  label: '파티 가져오기',
                  key: '2',
                  icon: <DownloadOutlined />,
                  danger: true,
                  onClick: () => hookMember.onClickOpenLoadDialog(),
                },
              ]}
            />
          }
        >
          파티 관리
        </Dropdown.Button>
      </FlexRow>

      {renderedGroupPanels ? (
        <Collapse defaultActiveKey={defaultOpenGroups}>
          {renderedGroupPanels}
        </Collapse>
      ) : (
        <FlexCenter css={{ width: '100%', height: '100%' }}>
          <Spin />
        </FlexCenter>
      )}
    </Flex>
  );
}
export default PartyPage;
