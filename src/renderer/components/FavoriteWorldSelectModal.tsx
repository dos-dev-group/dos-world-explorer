import { WorldPartial } from '@src/types';
import { message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useFavoritedWorld } from '../data/favoritedWorld';

// Modal Props Interface
interface Props {
  visible: boolean;
  world: WorldPartial;

  onOk?: (where: string, worldId: string) => void;
  onCancel: () => void;
}

export default function FavoriteWorldSelectModal(props: Props) {
  const { favoritedWorlds, addFavorite, removeFavorite } = useFavoritedWorld();
  const [where, setWhere] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!favoritedWorlds) {
      setLoading(true);
    } else if (!loading && favoritedWorlds) {
      setLoading(false);
    }
  }, [favoritedWorlds, loading]);

  const handleOk = async () => {
    setLoading(true);
    try {
      await addFavorite(where, props.world.key);
      message.success('즐겨찾기에 추가되었습니다.');
    } catch (error) {
      message.error(String(error));
    }
    setLoading(false);
    props.onOk?.(where, props.world.key);
  };

  const handleSelect = (value: string) => {
    setWhere(value);
  };

  const renderedOptions = favoritedWorlds?.map((e) => (
    <Select.Option key={e.groupInfo.name}>
      {e.groupInfo.displayName}
    </Select.Option>
  ));

  return (
    <>
      <Modal
        title="즐겨찾기 추가"
        visible={props.visible}
        onOk={handleOk}
        onCancel={props.onCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled: !where || where.trim() === '' }}
      >
        <Select
          placeholder="어디에 추가할까요?"
          style={{ width: '100%' }}
          onChange={handleSelect}
        >
          {renderedOptions}
        </Select>
        <br />
        <br />
      </Modal>
    </>
  );
}
