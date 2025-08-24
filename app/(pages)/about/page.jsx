import Story from "@/components/About/story/Story"
import Mission from "@/components/About/mission/Mission"
import Testimonials from "@/components/shared/testimonials/Testimonials"
import Cta from "@/components/shared/cta/Cta"
import Different from "@/components/About/different/Different"
import Header from "@/components/About/header/Header"

const page = () => {
  return (
    <>
      <Header />
      <Story />
      <Mission />
      <Different />
      <div>
        <Testimonials />
      </div>
      <Cta />
    </>
  )
}

export default page