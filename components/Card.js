import { useState } from 'react';
import { motion } from 'framer-motion';

const Card = (props) => {
  const { content } = props;
  const { title, description } = content;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div animate className={`card h-64`}>
        <div className="card-body p-4">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
      </motion.div>
    </>
  );
};

export default Card;
