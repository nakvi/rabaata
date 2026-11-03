import { T } from "@/components/Preferences";
import resources from "@/data/resources.json";
import locations from "@/data/locations.json";
export const metadata = { title: "About & sources" };
export default function About() {
  return (
    <main className="about">
      <div className="eyebrow">
        <T>A CLEARER WAY TO PUBLIC SERVICES</T>
      </div>
      <h1>
        <T>One starting point.</T>
        <br />
        <T>Many possibilities.</T>
      </h1>
      <p className="lead">
        <T>
          Raabta is an independent directory that helps you find Pakistan’s
          government websites, apps and public-service information.
        </T>
      </p>
      <section>
        <h2>
          <T>How this directory works</T>
        </h2>
        <p>
          <T>
            Choose your province and district, then search by task or
            department. Local listings appear first, followed by relevant
            regional and federal listings. Use local-only mode to exclude
            broader listings.
          </T>
        </p>
      </section>
      <section>
        <h2>
          <T>Coverage is growing</T>
        </h2>
        <p>
          <strong>{resources.length}</strong> <T>resources</T> ·{" "}
          <strong>
            {locations.filter((l) => l.type === "district").length}
          </strong>{" "}
          <T>district reference entries</T>
        </p>
        <p>
          <T>
            All 194 entries from the supplied Ask Pakistan directory are
            retained. Additional listings come from official provincial
            directories and department pages. This is a directory, not a
            complete inventory of government services.
          </T>
        </p>
      </section>
      <section>
        <h2>
          <T>Snapshot & district notes</T>
        </h2>
        <p>
          <T>
            The district reference set is dated 2 November 2026. Published
            sources differ for some newly created or activated districts.
            Karezat is included with its status under review. New administrative
            notifications may require updates.
          </T>
        </p>
      </section>
      <section>
        <h2>
          <T>Sources and editorial status</T>
        </h2>
        <p>
          <T>
            Every listing provides a source link. Importing a listing does not
            verify its availability, eligibility or service coverage. Confirm
            important details with the responsible department.
          </T>
        </p>
        <p>
          <a
            href="https://pakistangov.online/directory"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask Pakistan
          </a>{" "}
          ·{" "}
          <a
            href="https://www.sindh.gov.pk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <T>Sindh</T>
          </a>{" "}
          ·{" "}
          <a
            href="https://punjab.gov.pk/administrative-departments"
            target="_blank"
            rel="noopener noreferrer"
          >
            <T>Punjab</T>
          </a>
        </p>
      </section>
      <section>
        <h2>
          <T>Privacy</T>
        </h2>
        <p>
          <T>
            Bookmarks, language and theme preferences are saved only in your
            browser. There is no account, backend or document upload. Icons and
            fonts use Google services, which receive standard network
            information.
          </T>
        </p>
      </section>
      <section id="corrections">
        <h2>
          <T>Corrections and new listings</T>
        </h2>
        <p>
          <T>
            This static edition does not submit reports. The project owner can
            update the JSON files, validate them and redeploy. Owner contact
            details should be configured before public launch.
          </T>
        </p>
      </section>
      <section>
        <h2>
          <T>Independent, always clear</T>
        </h2>
        <p>
          <T>
            Raabta is not a government website. Applications, logins, payments
            and complaints take place on the relevant official platform.
          </T>
        </p>
      </section>
    </main>
  );
}
