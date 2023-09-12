/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter, Router } from "next/router";
import { useEffect, useRef } from "react";

interface Props {
  shouldPreventNavigation: boolean;
  onNavigate: () => void;
}

const useCustomNavigationConfirmation = ({
  shouldPreventNavigation,
  onNavigate,
}: Props) => {
  const router = useRouter();
  const isUserNavigating = useRef(shouldPreventNavigation);
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    isUserNavigating.current = shouldPreventNavigation;
  }, [shouldPreventNavigation]);

  useEffect(() => {
    const nativeBrowserHandler = (event: BeforeUnloadEvent) => {
      if (isUserNavigating.current ) {
        event.preventDefault();
        event.returnValue = "";
        // setShowModal(true);
        onNavigate();
      }
    };

    const handleRouteChangeStart = (url: string) => {
      if (isUserNavigating.current) {
        Router.events.emit("routeChangeError");
       
      }
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    window.addEventListener("beforeunload", nativeBrowserHandler);

    return () => {
      window.removeEventListener("beforeunload", nativeBrowserHandler);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  // const handleConfirm = () => {
  //   onNavigate();
  //   router.push(router.asPath);
  // };

  // const handleCancel = () => {
  //   setShowModal(false);
  // };

  // return (
  //   <>
  //     <ModalComponent
  //       isOpen={showModal}
  //       onConfirm={handleConfirm}
  //       onCancel={handleCancel}
  //     />
  //   </>
  // );
};

export default useCustomNavigationConfirmation;
