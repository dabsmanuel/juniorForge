import Cta from "@/components/shared/cta/Cta"
import Header from "@/components/Home/header/Header"
import WhoWeHelp from "@/components/Home/whoWeHelp/WhoWeHelp"
import Testimonials from "@/components/shared/testimonials/Testimonials"

const page = () => {
  return (
    <div className="">
      <Header />
      <WhoWeHelp />
      <Testimonials />
      <Cta />
    </div>
  )
}

export default page