/*
 * @Author: your name
 * @Date: 2020-06-01 11:41:44
 * @LastEditTime: 2020-06-05 10:16:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-form-design\src\container\column.js
 */

import React, { Component } from 'react'
import FormItem from './FormItem'
import { Droppable } from 'react-beautiful-dnd'
import { Form, Modal, Switch, Radio } from 'antd'
import { inject, observer } from 'mobx-react';
import common from '@/utils/common'
import Preview from './Preview'

@Form.create()
@inject('store')
@observer
class Mid extends Component {
    state = {
        visible: false
    }
    handleSubmit = () => {
        let self = this
        this.refs.Preview.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Modal.info({
                    width: '600px',
                    title: '动态表单json数据',
                    content: (
                        <div >
                            <div>
                                <span>表单配置(config)：</span>
                                <p><pre>{JSON.stringify(self.props.store.config.get, null, "\t")}</pre></p>
                            </div>
                            <div>
                                <span>表单项配置(content)：</span>
                                <p><pre>{JSON.stringify(self.props.store.content.get, null, "\t")}</pre></p>
                            </div>
                        </div>
                    ),
                    onOk() { },
                });
            }
        });
    };
    render() {
        const config = this.props.store.config.get
        const content = this.props.store.content.get
        const mode = this.props.store.mode.get
        return (
            <div className="mid" style={{ width: 'calc(100% - 416px)' }}>
                <h3 className="title">表单内容</h3>
                <p style={{ width: '100%' }}> {
                    common.isEmpty(content) ? '' :
                        <a style={{ float: 'left' }} onClick={() => this.setState({ visible: true })} >点击预览</a>
                }
                    <Radio.Group style={{ float: 'right' }} onChange={e => {
                        this.props.store.mode.set(e.target.value)
                    }} value={mode}>
                        <Radio value='pc'>PC模式</Radio>
                        <Radio value='phone'>手机模式</Radio>
                    </Radio.Group>
                </p>
                <Droppable droppableId={'content'} >
                    {(provided, snapshot) => {
                        return (
                            <div className={mode === 'pc' ? 'shell' : 'shell_phone'}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                <Form style={{ backgroundColor: '#FFF' }} layout={config.layout} labelAlign={config.labelAlign} onSubmit={this.handleSubmit}>
                                    {
                                        content.map(((el, i) =>
                                            <FormItem key={el.id} data={el} index={i} form={this.props.form} layout={config.layout} labelAlign={config.labelAlign} size={config.size} />
                                        ))
                                    }
                                </Form>
                                {provided.placeholder}
                            </div>
                        )
                    }}
                </Droppable>

                <Modal
                    title="表单预览"
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={() => this.setState({ visible: false })}
                    destroyOnClose
                    okText="模拟提交"
                >
                    <Preview ref="Preview" config={this.props.store.config.get} content={this.props.store.content.get} />
                </Modal>

            </div >
        )
    }
}

export default Mid