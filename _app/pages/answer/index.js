/*
 * @Author: middle
 * @Desc: Home
 * @Date: 2020/1/5 15:33
 * @Email: middle2021@gmail.com
 */
import { Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import Header from '../../components/header';
import { elevationShadowStyle, handleCatch, showToast } from '../../utils/utils';
import _ from 'lodash';
import { Button } from 'react-native-elements';
import { Progress, Modal } from '@ant-design/react-native';
import { SUBJECT_ENUM } from '../../utils/constant';
import ListOptions from './components/ListOptions';
import { goBack } from '../../utils/NavigationService';
import InputComponent from './components/InputComponent';
import moment from 'moment';
import ScaleComponent from './components/ScaleComponent';
import DropDownList from './components/DropDownList';
import { ApiService } from '../../http/APIService';
import Icon from 'react-native-vector-icons/AntDesign';

function Index (props) {

  const { userQuestionnaireId, questionnaireId, questionnaireName } = props.route.params || {};

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
    };
  }, []);
  //

  return (
    <View style={{ flex: 1 }}>
      <Header
        color={'#4E97FD'}
        back={true}
        backTitle={questionnaireName}
        statusBarProps={{
          barStyle: 'light-content',
          translucent: true,
          backgroundColor: '#4E97FD',
        }}
        backFunc={() => {
          if (isSuccessfully) {
            goBack();
          } else {
            Modal.alert('提示', '未完成答题，确认退出么？', [
              { text: '取消', onPress: () => {}, style: 'cancel' },
              {
                text: '确认', onPress: () => {
                  // 确认
                  goBack();
                },
              }]);
          }
        }}
        backIcon={(
          <Icon
            name={'close'}
            size={22}
            color={'white'}
          />
        )}
      />
      <View
        style={{
          flex: 1,
        }}>

        <View
          style={{
            borderRadius: 8,
            paddingTop: 15,
            marginHorizontal: 10,
            marginVertical: 15,
            flex: 1,
            backgroundColor: 'white',
            ...elevationShadowStyle(5),
          }}
        >
          {
            isSuccessfully ? renderSuccessfully() : (
              <React.Fragment>
                <View
                  style={{
                    flexDirection: 'row',
                    flexShrink: 0,
                    width: '100%',
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#d7dce5',
                    position: 'relative',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#000000',
                      flex: 1,
                      lineHeight: 26,
                    }}
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                  >
                    {
                      curItem?.subjectTypeName &&
                      curItem?.subjectType !== SUBJECT_ENUM.GUIDE
                      && _.range((curItem?.subjectTypeName).length + 1)
                        .map((v, index) => (<Text key={index}>&emsp;</Text>))
                    }
                    {curItem?.subjectType !== SUBJECT_ENUM.GUIDE && `${curIndex + 1}、`}
                    {curItem?.subjectTitle}
                  </Text>

                  {
                    curItem?.subjectType !== SUBJECT_ENUM.GUIDE && (
                      <Text
                        style={{
                          position: 'absolute',
                          left: 15,
                          color: '#dde1e9',
                          borderRadius: 1,
                          borderWidth: 1,
                          height: 26,
                          textAlign: 'center',
                          lineHeight: 24,
                          fontSize: 14,
                          borderColor: '#dde1e9',
                          paddingHorizontal: 5,
                          flexShrink: 0,
                        }}
                      >
                        {curItem?.subjectTypeName}
                      </Text>
                    )
                  }
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  {
                    curItem?.subjectType !== SUBJECT_ENUM.GUIDE && renderImage()
                  }
                  {
                    renderContent()
                  }
                  {
                    curItem?.subjectType === SUBJECT_ENUM.GUIDE && renderImage()
                  }
                </View>
                {
                  renderFooter()
                }
              </React.Fragment>
            )
          }
        </View>
      </View>
    </View>
  );

  function renderImage () {
    return curItem.subjectImage ? (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <Image
          style={{
            width: '100%',
            height: 180,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 8,
          }}
          resizeMode={'contain'}
          source={{ uri: curItem.subjectImage }}
        />
      </View>
    ) : null;
  }

  function renderSuccessfully () {

    const du = moment.duration(moment() - moment(answerStore.startTime), 'ms');
    const mins = du.get('minutes');
    const ss = du.get('seconds');

    return (
      <View
        style={{
          alignItems: 'center',
          paddingTop: 60,
        }}
      >
        <Image
          style={{
            width: 103,
            height: 90,
            marginBottom: 34,
          }}
          source={require('../../asset/images/icon_successfully.png')}
        />
        <Text
          style={{
            fontSize: 15,
            lineHeight: 23,
            color: '#c4cbcd',
            width: 200,
            textAlign: 'center',
          }}
        >
          {`恭喜完成问卷！感恩今天的${mins}分${ss}秒与您共同度过。`}
        </Text>
        <Button
          buttonStyle={{
            width: 240,
            marginTop: 61,
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: '#959394',
            borderRadius: 23.5,
          }}
          titleStyle={{
            fontSize: 15,
            color: '#111111',
          }}
          title={'返回首页'}
          onPress={goBack}
        />
      </View>
    );
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
      case SUBJECT_ENUM.MULTIPLE_CHOICE:
        return (
          <ListOptions
            options={curItem.options}
            type={'multiple'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE:
        return (
          <DropDownList
            options={curItem.options}
            type={'multiple'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE:
        return (
          <DropDownList
            options={curItem.options}
            type={'single'}
            subjectType={curItem?.subjectType}
          />
        );
      case SUBJECT_ENUM.COMPLETION:
        return (
          <InputComponent
            options={curItem.options}
          />
        );
      case SUBJECT_ENUM.GUIDE:
        return (
          <View
            style={{
              paddingHorizontal: 15,
              paddingTop: 30,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#666666',
                lineHeight: 23,
              }}
            >
              {curItem.guide}
            </Text>
          </View>
        );
      case SUBJECT_ENUM.SCALE:
        return (
          <ScaleComponent
            options={curItem.options}
          />
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
            marginHorizontal: 10,
            marginTop: 10,
            height: 7.5,
          }}
          barStyle={{
            borderRadius: 4,
            height: '100%',
            backgroundColor: '#e2ecff',
          }}
        />
        <View
          style={{
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flexShrink: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >

            {
              curIndex !== 0 ? (
                <Button
                  title="上一题"
                  titleStyle={{
                    color: '#4084FF',
                  }}
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
                        },
                      })
                      .catch(handleCatch);
                  }}
                />
              ) : (
                <View/>
              )
            }

            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Text
                style={{
                  color: '#4084FF',
                  fontSize: 18,
                }}
              >
                {curIndex + 1}
              </Text>
              <Text
                style={{
                  color: 'lightgray',
                  fontSize: 14,
                  paddingTop: 4,
                }}
              >
                /{subjects?.length}
              </Text>
            </View>

            <Button
              title={(isLast) ? '完成' : '下一题'}
              buttonStyle={{
                height: 32,
                paddingHorizontal: 10,
                backgroundColor: '#4084FF',
              }}
              titleStyle={{
                fontSize: 15,
              }}
              onPress={() => {

                if (
                  [
                    SUBJECT_ENUM.MULTIPLE_CHOICE, SUBJECT_ENUM.SINGLE_CHOICE,
                    SUBJECT_ENUM.DROPDOWN_SINGLE_CHOICE,
                    SUBJECT_ENUM.DROPDOWN_MULTIPLE_CHOICE,
                    SUBJECT_ENUM.SCALE,
                  ].includes(curItem.subjectType)) {
                  const noChecked = _.every(curItem.options, (v) => !v._checked);
                  if (noChecked) {
                    showToast('请完成作答~');
                    return;
                  }
                }

                if (
                  SUBJECT_ENUM.COMPLETION === curItem.subjectType
                ) {
                  const isEmpty = _.isEmpty(curItem.options[0].optionKey);
                  if (isEmpty) {
                    showToast('请完成作答~');
                    return;
                  }
                }

                if (isLast) {
                  // 最后一题

                  Modal.alert('提交问卷', (
                    <Text
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      确认提交当前问卷？一旦提交答案不可修改哦~
                    </Text>
                  ), [
                    { text: '取消', onPress: () => {}, style: 'cancel' },
                    {
                      text: '确认', onPress: () => {
                        if (curItem.subjectType === SUBJECT_ENUM.GUIDE) {
                          // 引导题
                          ApiService.submit({ userQuestionnaireId, questionnaireId }).then((res) => {
                            const [error] = res;
                            if (!error) {
                              // 直接跳转到成功页面
                              props.dispatch({
                                type: 'answer/updateSuccessfully',
                              });
                            }
                          });
                        } else {
                          // 其它题目
                          answer()
                            .then(() => {
                              // 其它题目
                              ApiService.submit({ userQuestionnaireId, questionnaireId }).then((res) => {
                                const [error] = res;
                                if (!error) {
                                  // 直接跳转到成功页面
                                  props.dispatch({
                                    type: 'answer/updateSuccessfully',
                                  });
                                }
                              });
                            }).catch(handleCatch);
                        }
                      }, style: 'ok',
                    },
                  ]);
                  return;
                }

                if (curItem.subjectType === SUBJECT_ENUM.GUIDE) {
                  // 引导题直接跳过，不提交
                  props.dispatch({
                    type: 'answer/updateCurIndex',
                    payload: curIndex + 1,
                  });
                  return;
                }

                // 答题
                answer().catch(handleCatch);

              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function answer () {
    // 答题
    return props
      .dispatch({
        type: 'answer/answer',
        payload: {
          curItem,
          userQuestionnaireId,
          questionnaireId,
        },
      })
      .then((res) => {
        // 提交完成
        if (isLast) {
          // 最后一题
        } else {
          // 下一题
          props.dispatch({
            type: 'answer/updateCurIndex',
            payload: curIndex + 1,
          });
        }
        return res;
      });
  }
}

function mapStateToProps (state) {
  return {
    answerStore: state.answer,
  };
}

export default connect(mapStateToProps)(Index);
