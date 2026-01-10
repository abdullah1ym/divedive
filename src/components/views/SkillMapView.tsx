import ProgressMap from "../ProgressMap";

interface SkillMapViewProps {
  onGoHome: () => void;
}

const SkillMapView = ({ onGoHome }: SkillMapViewProps) => {
  return <ProgressMap open={true} onClose={onGoHome} />;
};

export default SkillMapView;
