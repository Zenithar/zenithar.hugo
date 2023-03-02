{ stdenv, hugo, scour }:
stdenv.mkDerivation {
  name = "static-site";
  src = ./.;
  nativeBuildInputs = [
    # specify site build dependencies here
    hugo
    # optimize SVGs
    scour
  ];
  buildPhase = ''
    # prepare and build the site
    scour -i favicon-original.svg -o favicon.svg
    hugo -D
  '';
  installPhase = ''
    # install the Hugo output
    cp -r public $out
  '';
}
