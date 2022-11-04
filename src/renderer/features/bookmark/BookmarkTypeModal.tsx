import { FolderOutlined } from '@ant-design/icons';
import { Flex, FlexRow } from '@src/renderer/components/styledComponents';
import { spacing } from '@src/renderer/utils/styling';
import { Bookmarks } from '@src/types';
import { Avatar, Button, Input, List, Modal, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  onAddBookmark(type: string): void;
  onEditBookmark(type: string, newType: string): void;
  onRemoveBookmark(type: string): void;
  onCancel: () => void;

  bookmarks: Bookmarks;
  visible: boolean;
}
export default function BookmarkTypeModal(props: Props) {
  const [curEditItem, setCurEditItem] = useState<string | undefined>();
  const [newEditType, setNewEditType] = useState<string>('');
  const [newAddType, setNewAddType] = useState<string>('');

  const types = Object.keys(props.bookmarks);

  useEffect(() => {
    if (!props.visible) {
      setCurEditItem(undefined);
      setNewAddType('');
      setNewEditType('');
    }
  }, [props.visible]);

  return (
    <Modal
      open={props.visible}
      onCancel={() => props.onCancel()}
      title="북마크 관리"
      destroyOnClose
      footer={false}
    >
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={types}
        footer={
          <FlexRow css={{ alignItems: 'center' }}>
            <Input
              placeholder="북마크 이름"
              onChange={(e) => setNewAddType(e.target.value)}
              value={newAddType}
            />
            <Button
              disabled={newAddType.trim() === ''}
              css={{ marginLeft: spacing(1) }}
              onClick={() => {
                props.onAddBookmark(newAddType);
                setNewAddType('');
              }}
            >
              북마크 추가
            </Button>
          </FlexRow>
        }
        renderItem={(item) => {
          const bookmarkItem = props.bookmarks[item];
          const renderedEditButton =
            curEditItem === item ? (
              <Button
                type="primary"
                onClick={() => {
                  setCurEditItem(undefined);
                  setNewEditType('');
                }}
              >
                취소
              </Button>
            ) : (
              <Button
                ghost
                type="primary"
                onClick={() => {
                  setCurEditItem(item);
                  setNewEditType(item);
                }}
              >
                수정
              </Button>
            );
          const renderedRemoveButton = (
            <Popconfirm
              title="정말 북마크를 삭제하시겠습니까?"
              onConfirm={() => props.onRemoveBookmark(item)}
            >
              <Button danger>삭제</Button>
            </Popconfirm>
          );

          return (
            <List.Item
              // TODO 수정버튼 useBookmarkPage에서 참조하는 Memo때문에 현재 안됨
              //@ts-ignore
              actions={[renderedEditButton, renderedRemoveButton]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<FolderOutlined />} />}
                title={
                  item === curEditItem ? (
                    <Input
                      value={newEditType}
                      onChange={(e) => setNewEditType(e.target.value.trim())}
                      onPressEnter={() => {
                        props.onEditBookmark(item, newEditType);
                        setCurEditItem(undefined);
                        setNewEditType('');
                      }}
                    />
                  ) : (
                    item
                  )
                }
                description={'북마크 갯수: ' + bookmarkItem.length}
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
}
