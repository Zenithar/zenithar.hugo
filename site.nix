{ stdenv, hugo }:
stdenv.mkDerivation {
  name = "static-site";
  src = ./.;
  nativeBuildInputs = [
    # specify site build dependencies here
    hugo
  ];
  buildPhase = ''
    # prepare and build the site
    hugo -D
  '';
  installPhase = ''
    # install the Hugo output
    cp -r public $out
  '';
}
