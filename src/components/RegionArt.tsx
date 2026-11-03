import { T } from "@/components/Preferences";
import {
  Landmark,
  Fingerprint,
  GraduationCap,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
export default function RegionArt() {
  return (
    <div
      className="region-art"
      aria-label="Illustration of connected public services"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-dots" />
      <div className="platform platform-back" />
      <div className="platform platform-front">
        <div className="platform-grid" />
        <Landmark className="building" strokeWidth={1.1} />
        <span className="platform-caption">
          <T>CONNECTED PAKISTAN</T>
        </span>
      </div>
      <div className="float-card fc-one">
        <span className="art-icon">
          <Fingerprint />
        </span>
        <div>
          <strong>
            <T>Your identity</T>
          </strong>
          <small>
            <T>One clear starting point</T>
          </small>
        </div>
        <ArrowUpRight size={15} />
      </div>
      <div className="float-card fc-two">
        <span className="art-icon gold">
          <GraduationCap />
        </span>
        <div>
          <strong>
            <T>New possibilities</T>
          </strong>
          <small>
            <T>Education & opportunities</T>
          </small>
        </div>
      </div>
      <div className="location-pill">
        <MapPin size={15} />
        <T> From your district. To your next step.</T>
      </div>
      <span className="art-star">✳</span>
    </div>
  );
}
