import React from 'react'
import { requireNativeComponent } from 'react-native'


const YearPickerView =(props) => <YearPicker {...props}/>


const YearPicker = requireNativeComponent(
    'YearMonthPicker',
    YearPickerView,
)

export default YearPicker;