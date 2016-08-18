/**
 * Created by zhengyingya on 16/6/24.
 */
import React from 'react'
import {useRouterHistory} from 'react-router'
import {createHistory} from 'history'

export const History = useRouterHistory(createHistory)({ basename: '' });