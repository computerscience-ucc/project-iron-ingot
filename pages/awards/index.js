
import Head from '../../components/Head';
import TopGradient from '../../components/TopGradient';
import { _Transition_Page } from '../../components/_Animations';
import { motion } from 'framer-motion';

const Awards = () => {
  return (
    <>
      <TopGradient colorLeft={'#fd0101'} colorRight={'#a50000'} />
      <Head 
        title="Awards | Ingo"
        description="Outstanding achievements and awards in the BSCS program. Celebrating student excellence in Computer Science."
        url="/awards"
      />

      <motion.main
        variants={_Transition_Page}
        initial="initial"
        animate="animate"
        exit="exit"
        className="py-36 z-10 min-h-screen"
      >
        <div className="flex flex-col gap-2 justify-center mt-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Awards & Recognition
          </h1>
          <p className="text-center text-gray-500 mb-16">
            Celebrating excellence in the BSCS Program
          </p>
          
          {/* Add your awards content here */}
          <div className="text-center">
            <p className="text-gray-400">Awards content coming soon...</p>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Awards;