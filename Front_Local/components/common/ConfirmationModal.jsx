import IconBtn from "./IconBtn"


export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white/10  backdrop-blur-sm">
      <div className="w-10/12 max-w-[350px] rounded-lg border border-[#6E727F] bg-[#161D29] p-6">
        <p className="text-2xl font-semibold text-[#F1F2FF]">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-[#999DAA]">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-[#999DAA] py-[8px] px-[20px] font-semibold text-[#000814]"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}