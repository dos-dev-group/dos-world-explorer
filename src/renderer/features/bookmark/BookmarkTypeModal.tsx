import { FolderOutlined } from '@ant-design/icons';
import { Bookmarks } from '@src/types';
import { Avatar, Button, Input, List, Modal, Popconfirm } from 'antd';
import { useState } from 'react';

interface Props {
  onEditBookmark(type: string, newType: string): void;
  onRemoveBookmark(type: string): void;
  onCancel: () => void;

  bookmarks: Bookmarks;
  visible: boolean;
}
export default function BookmarkTypeModal(props: Props) {
  const [curEditItem, setCurEditItem] = useState<string | undefined>();
  const [newType, setNewType] = useState<string>('');

  const types = Object.keys(props.bookmarks);

  return (
    <Modal
      visible={props.visible}
      onCancel={() => props.onCancel()}
      title="북마크 관리"
      destroyOnClose
      footer={false}
    >
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={types}
        renderItem={(item) => {
          const bookmarkItem = props.bookmarks[item];
          const renderedEditButton =
            curEditItem === item ? (
              <Button
                type="primary"
                onClick={() => {
                  setCurEditItem(undefined);
                  setNewType('');
                }}
              >
                취소
              </Button>
            ) : (
              <Button ghost type="primary" onClick={() => setCurEditItem(item)}>
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
              //@ts-ignore
              actions={[renderedEditButton, renderedRemoveButton]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<FolderOutlined />} />}
                title={
                  item === curEditItem ? (
                    <Input
                      onChange={(e) => setNewType(e.target.value.trim())}
                      onPressEnter={() => {
                        props.onEditBookmark(item, newType);
                        setCurEditItem(undefined);
                        setNewType('');
                      }}
                    />
                  ) : (
                    item
                  )
                }
                description={'현재 북마크 갯수: ' + bookmarkItem.length}
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
}
