import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui";

const Modal = ({
  isOpen = Boolean,
  onClose = () => {},
  onSubmit = () => {},
  title = null,
  body = React.Component,
  footer = React.Component,
  actionLabel = null,
  disabled = Boolean,
  secondaryAction = () => {},
  secondaryActionLabel = null,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handelClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-full sm:max-w-sm md:max-w-md lg:max-w-lg my-6 mx-auto  h-fit  lg:h-auto md:h-fit">
          {/*content*/}
          <div
            className={`translateduration-300h-full ${
              showModal ? "translate-y-0" : "translate-y-full"
            }${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className=" translate h-full lg:h-auto md:h-auto border-0  rounded-lg  shadow-lg  relative  flex  flex-col  w-full  bg-white  outline-none  focus:outline-none">
              {/*header*/}
              <div className=" flex  items-center  p-6 rounded-t justify-center relative border-b-[1px] ">
                <button
                  className=" p-1 border-0 hover:opacity-70 transition absolute left-9"
                  onClick={handelClose}
                >
                  x
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* Body */}
              <div className="relative p-6 flex-auto">{body}</div>
              {/* Footer */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      label={secondaryActionLabel}
                      outline
                      onClick={handleSecondaryAction}
                      className={"p-1.5 w-full"}
                    />
                  )}
                  <Button label={actionLabel} primary onClick={handleSubmit} />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
