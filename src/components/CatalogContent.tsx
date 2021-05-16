import React, { useState } from 'react'
import { Layout, Card, Radio, Button, Modal, Rate } from 'antd';
import { CatalogContentList } from './CatalogContentList';
import { CatalogContentTiles } from './CatalogContentTiles';
import {  UnorderedListOutlined, AppstoreOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { TSort } from '../models/SortModel';
import { TList } from '../models/ListModel';

type TCatalogContent = {
	productList: TList[],
	listReviews: any
}

export const CatalogContent: React.FC<TCatalogContent> = (props) => {
	const [state, setState] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false);
  const [keyValue, setKeyValue] = useState<number>(0);
  const [titleModal, setTitleModal] = useState<string>('');

	const defaultDirection = 'desc';
	const [sortParams, setSortParams] = useState<TSort>({
		prop: 'rate',
		direction: defaultDirection,
	})
	const getKeyFromReviews = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: number | undefined) => {
		if(key) {
			const productTitle = props.productList.filter(elem => elem.key === key)
			setTitleModal(productTitle[0].title);
			setKeyValue(key)
			setVisible(true)
		}
	}

	const { Content } = Layout;
	
	const tabList = [
		{
			key: 'tab1',
			tab: <UnorderedListOutlined />,
		},
		{
			key: 'tab2',
			tab: <AppstoreOutlined />,
		},
	];

	const contentList: {[index: string]:any} = {
		tab1: <CatalogContentList sortParams={sortParams} {...props} getKeyFromReviews={getKeyFromReviews} />,
		tab2: <CatalogContentTiles sortParams={sortParams} {...props} getKeyFromReviews={getKeyFromReviews} />
	};
	const onSortChange = (propName: TSort['prop'], changeDirection: boolean) => {
		setSortParams((prevSort) => {
			const newDirection = prevSort.direction === 'desc' ? 'asc' : 'desc';
			return {
				prop: propName,
				direction: changeDirection ? newDirection : defaultDirection,
			}
		})
	}

	const onTabChange = (key: string, type: string) => {
    setState({ [type]: key });
  };

	return (
		<>
			<Content style={{ padding: '0 24px', minHeight: 280, maxWidth: 1480 }}>
				<h2>Смартфоны</h2>
				<div className="container-header-filter">
					<Card
						style={{ width: '95' }}
						tabList={ tabList }
						activeTabKey={ state.key }
						onTabChange={ key => {
							onTabChange( key, 'key' );
						}}
					>
					</Card>
					<div className="sort-container">
						<p className="sort-by">Сортировать по </p>
						<Radio.Group defaultValue="rate">
							<Radio.Button value="rate" onClick={() => onSortChange('rate', false)}>Популярности</Radio.Button>
							<Radio.Button value="price" onClick={() => onSortChange('price', true)}>{ sortParams.direction === 'desc' ? <SortAscendingOutlined /> :  <SortDescendingOutlined /> }  Цене</Radio.Button>
						</Radio.Group>
					</div>
				</div>
				{ state.key ? contentList[ state.key ] : contentList['tab1'] }
			</Content>
      <Modal
        title={'Отзывы — ' + titleModal}
        centered
        visible={visible}
        width={900}
				onCancel={() => setVisible(false)}
				footer={[
					<Button key="back" className="modal-show" onClick={() => setVisible(false)}>
						Закрыть
					</Button>,
				]}
      >
				{props.listReviews[keyValue].map((elem: any) => (
					<div className="container-modal">
						<div className="profile">
							<p>{elem.name}</p>
							<p>{elem.date}</p>
							<Rate disabled allowHalf defaultValue={elem.rate} />
						</div>
						<div className="comment">
							<span>{elem.comment}</span>
						</div>
					</div>
				))}

      </Modal>
		</>
	)
}