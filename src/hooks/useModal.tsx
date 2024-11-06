import { useState } from "react"

type ModalTypeProps = 'success' | 'error' | 'loading' | 'info'
type ButtonColorProps = 'success' | 'error' | 'primary' | 'secondary'

export const useModal = () => {

    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const [modalType, setModalType] = useState<ModalTypeProps>('info')
    const [title, setTitle] = useState<string>('')
    const [icon, setIcon] = useState<string>('')
    const [buttonValue, setButtonValue] = useState<string>('')
    const [buttonColor, setButtonColor] = useState<ButtonColorProps>('primary')

    const openModal = (
        modalType: ModalTypeProps,
        title: string,
        icon?: string,
        buttonValue?: string,
        buttonColor?: ButtonColorProps,
    ) => {
        setToggleModal(true)
        setModalType(modalType)
        setTitle(title)
        if (buttonValue && buttonColor && icon) {
            setIcon(icon)
            setButtonValue(buttonValue)
            setButtonColor(buttonColor)
        }
    }

    const closeModal = () => {
        setToggleModal(false)
    }

    return {
        toggleModal,
        modalType,
        title,
        icon,
        buttonValue,
        buttonColor,
        openModal,
        closeModal
    }
}