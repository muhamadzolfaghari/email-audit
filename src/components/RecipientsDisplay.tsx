import {useEffect, useRef} from "react";

interface RecipientsDisplay {
  recipients: string[]
}

export default function RecipientsDisplay({recipients}: RecipientsDisplay) {
  const rootRef = useRef<HTMLDivElement>(null);


  useEffect(() => {

    function handleResize() {

    }

    document.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("resize", handleResize);
    }
  }, []);


  return <div ref={rootRef}>{recipients.map(recipinet => <div>{recipinet}</div>)}</div>
}
