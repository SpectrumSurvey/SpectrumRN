/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import {SafeAreaView, Text, View} from 'react-native';
import {connect} from 'react-redux';
import React, { useEffect } from 'react';
import Header from '../../components/header'
import { handleCatch, showToast } from '../../utils/utils';
import _ from 'lodash';
import { Button } from 'react-native-elements';
import { Progress, Modal } from '@ant-design/react-native';
import { SUBJECT_ENUM } from '../../utils/constant';
import ListOptions from './components/ListOptions';
import { goBack } from '../../utils/NavigationService';

function Index(props) {

  const { userQuestionnaireId = 7, questionnaireId = 3, questionnaireName } = props.route.params || {};

  const { answerStore } = props;

  const { curIndex, info: { questionnaire }, isSuccessfully } = answerStore;

  const { subjects } = questionnaire || {};

  // 当前的题目
  const curItem = _.isEmpty(subjects) ? {} : subjects[curIndex];

  // 最后一题
  const isLast = ((curIndex + 1) === subjects?.length);

  useEffect(() => {
    props
      .dispatch({
        type: 'answer/loadData',
        payload: {
          userQuestionnaireId,
          questionnaireId,
        },
      })
      .catch(handleCatch);

    return () => {
      props
        .dispatch({
          type: 'answer/reset',
        });
    }
  }, []);
  //

  return (
    <View style={{flex: 1}}>
      <Header
        color={'#6769FB'}
        back={true}
        backTitle={questionnaireName}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#6769FB',
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 15,
        }}>

        <View
          style={{
            borderRadius: 8,
            paddingTop: 15,
            shadowOpacity: 0.85,
            flex: 1,
            shadowRadius: 5,
            shadowColor: '#999999',
            backgroundColor: 'white',
            shadowOffset: { height: 0, width: 0 },
          }}
        >
          {
            isSuccessfully ? renderSuccessfully() : (
              <React.Fragment>
                <View
                  style={{
                    flexDirection: 'row',
                    flexShrink: 0,
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#d7dce5',
                  }}
                >
                  <Text
                    style={{
                      color: '#dde1e9',
                      borderRadius: 1,
                      borderWidth: 1,
                      borderColor: '#dde1e9',
                      paddingHorizontal: 5,
                      paddingVertical: 3,
                    }}
                  >
                    {curItem?.subjectTypeName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#000000',
                      marginLeft: 10
                    }}
                  >
                    {curIndex + 1}、{curItem?.subjectTitle}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  {
                    renderContent()
                  }
                </View>
                {
                  renderFooter()
                }
              </React.Fragment>
            )
          }
        </View>
      </SafeAreaView>
    </View>
  );

  function renderSuccessfully () {
    return (
      <View>
        <Text>感谢完成问卷</Text>
        <Button
          title={'返回首页'}
          onPress={() => goBack()}
        />
      </View>
    )
  }

  function renderContent () {

    switch (curItem?.subjectType) {
      case SUBJECT_ENUM.SINGLE_CHOICE:
        return (
          <ListOptions
            options={curItem.options}
            type={'single'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.COMPLETION:
        return (
          <Text>填空题</Text>
        );
      case SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE:
        return (
          <ListOptions
            options={curItem.options}
            type={'multiple'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE:
        return (
          <ListOptions
            options={curItem.options}
            type={'single'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.GUIDE:
        return (
          <Text>引导题</Text>
        );
      case SUBJECT_ENUM.MULTIPLE_CHOICE:
        return (
          <ListOptions
            options={curItem.options}
            type={'multiple'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.SCALE:
        return (
          <Text>量表题</Text>
        );
    }
  }

  function renderFooter () {
    return (
      <View
        style={{
          flexShrink: 0,
        }}
      >
        <Progress
          percent={((curIndex + 1) / subjects?.length) * 100}
          unfilled={true}
          style={{
            width: '100%',
            marginHorizontal: 10,
            marginTop: 10
          }}
          barStyle={{
            height: 7.5,
            backgroundColor: '#e2ecff',
          }}
        />
        <View
          style={{
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 10
          }}
        >
          <View
            style={{
              flexShrink: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >

            <Button
              title="上一题"
              type="clear"
              onPress={() => {
                if (!curIndex) {
                  return;
                }

                if (subjects[curIndex - 1].subjectType === SUBJECT_ENUM.GUIDE) {
                  // 上一题是引导题不请求，直接跳到上一题
                  props.dispatch({
                    type: 'answer/updateCurIndex',
                    payload: curIndex - 1,
                  });
                  return;
                }

                props
                  .dispatch({
                    type: 'answer/feedbackOptions',
                    payload: {
                      curItem: subjects[curIndex - 1],
                      userQuestionnaireId,
                      questionnaireId,
                    }
                  })
                  .catch(handleCatch);
              }}
            />

            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <Text>{curIndex + 1}</Text>
              <Text>/{subjects?.length}</Text>
            </View>

            <Button
              title={(isLast) ? '完成' : '下一题'}
              onPress={() => {
                if (isLast) {
                  // 最后一题
                  if (curItem.subjectType === SUBJECT_ENUM.GUIDE) {
                    // 直接跳转到成功页面
                    props.dispatch({
                      type: 'answer/updateSuccessfully',
                    });
                    return;
                  }
                }

                if (curItem.subjectType === SUBJECT_ENUM.GUIDE) {
                  // 引导题直接跳过，不提交
                  props.dispatch({
                    type: 'answer/updateCurIndex',
                    payload: curIndex + 1,
                  });
                  return;
                }

                if (
                  [
                    SUBJECT_ENUM.MULTIPLE_CHOICE, SUBJECT_ENUM.SINGLE_CHOICE,
                    SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE, SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE,
                  ].includes(curItem.subjectType)) {

                  const noChecked = _.every(curItem.options, (v) => !v._checked)

                  if (noChecked) {
                    showToast('请选择选项');
                    return;
                  }

                }

                if (isLast) {
                  // 弹窗提示是否提交
                  Modal.alert('提交问卷', '确认提交当前问卷？一旦提交答案不可修改哦~', [
                    { text: '取消', onPress: () => {}, style: 'cancel' },
                    { text: '确认', onPress: () => answer(), style: 'ok' },
                  ]);
                } else {
                  // 答题
                  answer()
                }

              }}
            />
          </View>
        </View>
      </View>
    )
  }

  function answer () {
    // 答题
    props
      .dispatch({
        type: 'answer/answer',
        payload: {
          curItem,
          userQuestionnaireId,
          questionnaireId,
        },
      })
      .then(() => {
        // 提交完成
        if (isLast) {
          // 最后一题
          props.dispatch({
            type: 'answer/updateSuccessfully',
          })
        } else {
          // 下一题
          props.dispatch({
            type: 'answer/updateCurIndex',
            payload: curIndex + 1,
          })
        }
      })
      .catch(handleCatch);
  }
}

function mapStateToProps(state) {
  return {
    answerStore: state.answer,
  };
}

export default connect(mapStateToProps)(Index);
