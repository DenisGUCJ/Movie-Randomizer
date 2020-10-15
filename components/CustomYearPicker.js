import YearPickerDialogModule from './YearPickerDialogModule'

const NATIVE_FORMAT = 'YYYY'
const DEFAULT_OUTPUT_FORMAT = 'YYYY'

const CustomYearPicke = ({
    value,

}) => {
    YearPickerDialogModule.open({
        value: 1000,
    }).then(
        function resolve({ action, year }) {
            
        },
        function reject(error){
            throw error;
        }
    )
}

export default CustomYearPicke;